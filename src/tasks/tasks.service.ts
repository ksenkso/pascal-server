import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from '../dto/task.dto';
import {
  AssessmentFactory,
  SerializedAssessment,
  SerializedAssessmentDocument
} from '../schemas/serialized-assessment.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(SerializedAssessment.name) private assessmentModel: Model<SerializedAssessmentDocument>
  ) {
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const created = new this.taskModel(createTaskDto);

    if (createTaskDto.assessments) {
      const assessments: SerializedAssessment[] = createTaskDto.assessments.map(a => {
        return AssessmentFactory
          .createAssessment(a)
          .serialize();
      });
      created.assessments = await this.assessmentModel.create(assessments);
    }

    return created.save();
  }

  async findAll(): Promise<TaskDocument[]> {
    return this.taskModel.find().populate('assessments')
      .exec()
  }

  async clear(): Promise<void> {
    return this.taskModel.remove();
  }
}
