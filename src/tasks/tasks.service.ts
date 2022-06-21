import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import {
  AssessmentFactory,
  SerializedAssessment,
  SerializedAssessmentDocument
} from '../schemas/serialized-assessment.schema';
import { TaskSet, TaskSetDocument } from '../schemas/task-set.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(TaskSet.name) private taskSetModel: Model<TaskSetDocument>,
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

    await this.taskSetModel
      .findById(createTaskDto.taskSet)
      .update({ $push: { tasks: created._id } })
      .exec();

    return created.save();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const updated = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();

    if (updateTaskDto.assessments) {
      const assessments: SerializedAssessment[] = updateTaskDto.assessments.map(a => {
        return AssessmentFactory
          .createAssessment(a)
          .serialize();
      });
      updated.assessments = await this.assessmentModel.create(assessments);
    }

    return updated.save();
  }

  async findAll(): Promise<TaskDocument[]> {
    return this.taskModel.find().populate(['taskSet', 'assessments'])
      .exec()
  }

  async clear(): Promise<void> {
    return this.taskModel.remove();
  }

  async findOne(id: string): Promise<TaskDocument> {
    return this.taskModel.findById(id).populate(['taskSet', 'assessments'])
      .exec()
  }

  delete(id: string) {
    return this.taskModel.findById(id).deleteOne().exec();
  }
}
