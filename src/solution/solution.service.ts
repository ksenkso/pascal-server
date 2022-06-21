import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { writeFile } from 'fs/promises';
import { v4 } from 'uuid';
import { spawn } from 'child_process';
import { Collector } from './collector';
import { CompilationError, PascalRuntimeError, ResultError } from './errors';
import { Task, TaskDocument } from '../schemas/task.schema';
import { AssessmentResult } from './assessments/assessment';
import { AssessmentFactory } from '../schemas/serialized-assessment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { is } from '../utils/utils';
import { CreateSolutionDto, UpdateSolutionDto } from '../dto/solution.dto';
import { BasicService } from '../utils/BasicService';
import { Solution, SolutionDocument } from '../schemas/solution.schema';
import { Comment, CommentDocument } from '../schemas/comment.schema';

export interface SolutionAssessmentResult {
  average: number;
  messages: string[];
  output: string;
  successful: boolean;
}

export class SolutionAssessment {
  private output = '';
  public successful = true;

  constructor(private programFileName: string, private score = 0, private messages: string[] = []) {
  }

  getProgramFileName() {
    return this.programFileName;
  }

  addResult(result: AssessmentResult) {
    this.score += result.score;
    this.messages.push(result.description);
  }

  setOutput(output: string) {
    this.output = output;
  }

  toJSON(): SolutionAssessmentResult {
    return {
      average: this.score / this.messages.length,
      messages: this.messages,
      output: this.output,
      successful: this.successful,
    }
  }

  static wrongResult(error: ResultError): SolutionAssessment {
    const assessment = new SolutionAssessment(error.fileName, 0, [error.message]);
    assessment.setOutput(error.stdout);
    assessment.successful = false;

    return assessment;
  }

  static runtimeErrorResult(error: PascalRuntimeError): SolutionAssessment {
    const assessment = new SolutionAssessment(error.fileName, 0, [error.message]);
    assessment.setOutput(error.stdout);
    assessment.successful = false;

    return assessment;
  }

  static assessmentErrorResult(fileName: string, error: Error): SolutionAssessment {
    const assessment =  new SolutionAssessment(fileName, AssessmentResult.MIN_SCORE, [error.message]);
    assessment.successful = false;

    return assessment;
  }

  static compilationErrorResult(error: CompilationError): SolutionAssessment {
    const assessment = new SolutionAssessment(error.fileName, 0, [error.message]);
    assessment.setOutput(error.stderr);
    assessment.successful = false;

    return assessment;
  }
}

@Injectable()
export class SolutionService extends BasicService<SolutionDocument, CreateSolutionDto, UpdateSolutionDto>{
  private static outputDir = '/tmp/pascal-server/output';
  private static sourcesDir = '/tmp/pascal-server/sources';

  constructor(
    @InjectModel(Solution.name) private solutionModel: Model<SolutionDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {
    super(solutionModel);
    fs.stat(SolutionService.outputDir)
      .catch(() => fs.mkdir(SolutionService.outputDir, { recursive: true }));
    fs.stat(SolutionService.sourcesDir)
      .catch(() => fs.mkdir(SolutionService.sourcesDir, { recursive: true }));
  }

  async checkSolution(solution: CreateSolutionDto): Promise<SolutionAssessment> {
    const task = await this.taskModel.findById(solution.task);
    const createdSolution = await this.model.create(solution);

    const assessment = await this.createProgramFile(solution.code)
      .then(this.compile.bind(this))
      .then((assessment) => this.checkResult(assessment, task.expectedResult))
      .then((assessment) => this.assessProgram(assessment, solution.code, task))
      .catch(err => {
        if (is(err, ResultError)) {
          return SolutionAssessment.wrongResult(err);
        }
        if (is(err, PascalRuntimeError)) {
          return SolutionAssessment.runtimeErrorResult(err);
        }
        if(is(err, CompilationError)) {
          return SolutionAssessment.compilationErrorResult(err);
        }

        return SolutionAssessment.assessmentErrorResult('no file name', err);
      })

    const json = assessment.toJSON();
    createdSolution.score = json.average;
    await createdSolution.save();

    return assessment;
  }

  private createProgramFile(source: string): Promise<SolutionAssessment> {
    const name = path.resolve(__dirname, SolutionService.sourcesDir, `${v4()}.pas`);

    return writeFile(name, source, 'utf8')
      .then(() => new SolutionAssessment(name));
  }

  private compile(assessment: SolutionAssessment): Promise<SolutionAssessment> {
    return new Promise((resolve, reject) => {
      const compilation = spawn('fpc', ['-Tlinux', `-FE${SolutionService.outputDir}`, assessment.getProgramFileName()]);

      const outCollector = new Collector(compilation.stdout);

      compilation.on('close', (compileCode) => {
        const errors = outCollector.getAll().split('\n').slice(4).join('\n');

        if (compileCode) {
          reject(new CompilationError(assessment.getProgramFileName(), errors, compileCode))
        } else {
          resolve(assessment);
        }
      });
    });
  }

  private checkResult(assessment: SolutionAssessment, expected: string, args: string[] = []): Promise<SolutionAssessment> {
    return new Promise((resolve, reject) => {
      const executableName = path.basename(assessment.getProgramFileName(), '.pas');
      const run = spawn(path.resolve(__dirname, SolutionService.outputDir, executableName), args);
      const resultCollector = new Collector(run.stdout);
      const errorCollector = new Collector(run.stderr);

      run.on('close', (runCode) => {
        const code = Number(runCode);
        const result = resultCollector.getAll();

        assessment.setOutput(result);

        if (runCode) {
          reject(new PascalRuntimeError(assessment.getProgramFileName(), result, errorCollector.getAll(), code));
          return;
        }

        if (result !== expected) {
          reject(new ResultError(assessment.getProgramFileName(), result, expected));
          return;
        }

        resolve(assessment);
      });
    });
  }

  private assessProgram(assessment: SolutionAssessment, source: string, task: TaskDocument): SolutionAssessment {
    const assessments = task.assessments.map(AssessmentFactory.createAssessment);

    assessments.forEach(a => {
      assessment.addResult(a.run(source));
    });

    return assessment;
  }

  getForUser(userId: string) {
    return this.solutionModel.find({ user: userId }).populate(['task', 'comments', 'student']).exec();
  }
}
