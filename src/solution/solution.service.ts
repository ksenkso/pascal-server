import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { writeFile } from 'fs/promises';
import { v4 } from 'uuid';
import { spawn } from 'child_process';
import { Collector } from './collector';
import { PascalRuntimeError, ResultError } from './errors';
import { Task, TaskDocument } from '../schemas/task.schema';
import { AssessmentResult } from './assessments/assessment';
import { AssessmentFactory } from '../schemas/serialized-assessment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { is } from '../utils/utils';

export class Solution {
  code: string;
}

export interface SolutionAssessmentResult {
  average: number;
  messages: string[];
}

export class SolutionAssessment {
  constructor(private score = 0, private messages: string[] = []) {
  }

  addResult(result: AssessmentResult) {
    this.score += result.score;
    this.messages.push(result.description);
  }

  toJSON(): SolutionAssessmentResult {
    return {
      average: this.score / this.messages.length,
      messages: this.messages,
    }
  }

  static wrongResult(error: ResultError): SolutionAssessment {
    return new SolutionAssessment(0, [error.message]);
  }

  static runtimeErrorResult(error: PascalRuntimeError): SolutionAssessment {
    return new SolutionAssessment(0, [error.message]);
  }

  static assessmentErrorResult(error: Error): SolutionAssessment {
    return new SolutionAssessment(AssessmentResult.MIN_SCORE, [error.message]);
  }
}

@Injectable()
export class SolutionService {
  private static outputDir = '/tmp/pascal-server/output';
  private static sourcesDir = '/tmp/pascal-server/sources';

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {
    fs.stat(SolutionService.outputDir)
      .catch(() => fs.mkdir(SolutionService.outputDir, { recursive: true }));
    fs.stat(SolutionService.sourcesDir)
      .catch(() => fs.mkdir(SolutionService.sourcesDir, { recursive: true }));
  }

  async checkSolution(solution: Solution, taskId: string): Promise<SolutionAssessment> {
    const task = await this.taskModel.findById(taskId);

    return this.createProgramFile(solution.code)
      .then(this.compile.bind(this))
      .then((programFileName) => this.checkResult(programFileName, task.expectedResult))
      .then(() => this.assessProgram(solution.code, task))
      .catch(err => {
        if (is(err, ResultError)) {
          return SolutionAssessment.wrongResult(err);
        }
        if (is(err, PascalRuntimeError)) {
          return SolutionAssessment.runtimeErrorResult(err);
        }

        return SolutionAssessment.assessmentErrorResult(err);
      })
  }

  private createProgramFile(source: string): Promise<string> {
    const name = path.resolve(__dirname, SolutionService.sourcesDir, `${v4()}.pas`);

    return writeFile(name, source, 'utf8')
      .then(() => name);
  }

  private compile(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const compilation = spawn('fpc', ['-Tlinux', `-FE${SolutionService.outputDir}`, file]);

      const outCollector = new Collector(compilation.stdout);

      compilation.on('close', (compileCode) => {
        const errors = outCollector.getAll().split('\n').slice(4).join('\n');

        if (compileCode) {
          reject({ code: compileCode, errors });
        } else {
          resolve(file);
        }
      });
    });
  }

  private checkResult(programFileName: string, expected: string, args: string[] = []): Promise<string> {
    return new Promise((resolve, reject) => {
      const executableName = path.basename(programFileName, '.pas');
      const run = spawn(path.resolve(__dirname, SolutionService.outputDir, executableName), args);
      const resultCollector = new Collector(run.stdout);
      const errorCollector = new Collector(run.stderr);

      run.on('close', (runCode) => {
        const code = Number(runCode);
        const result = resultCollector.getAll();

        if (runCode) {
          reject(new PascalRuntimeError(result, errorCollector.getAll(), code));
          return;
        }

        if (result !== expected) {
          reject(new ResultError(result, expected));
          return;
        }

        resolve(programFileName);
      });
    });
  }

  private assessProgram(source: string, task: TaskDocument): SolutionAssessment {
    const assessments = task.assessments.map(AssessmentFactory.createAssessment);

    const solutionAssessment = new SolutionAssessment();
    assessments.forEach(assessment => {
      solutionAssessment.addResult(assessment.run(source));
    });

    return solutionAssessment;
  }
}
