import { Injectable } from '@nestjs/common';
import { CreateTaskSetDto } from './dto/create-task-set.dto';
import { UpdateTaskSetDto } from './dto/update-task-set.dto';
import { BasicService } from '../utils/BasicService';
import { TaskSet, TaskSetDocument } from '../schemas/task-set.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TaskSetService extends BasicService<TaskSetDocument, CreateTaskSetDto, UpdateTaskSetDto>{
  constructor(@InjectModel(TaskSet.name) taskSetModel: Model<TaskSetDocument>) {
    super(taskSetModel);
  }

  findForGroup(groupId: string) {
    return this.model.find({ group: groupId }).populate(['tasks', 'group']).exec();
  }
}
