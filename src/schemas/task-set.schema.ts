import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';
import { Task, TaskSchema } from './task.schema';
import { ResourceScope } from '../utils/resource-scope.enum';
import { Group } from './group.schema';

export type TaskSetDocument = TaskSet & Document;

@NestSchema()
export class TaskSet {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Schema.Types.String })
  scope: ResourceScope;

  @Prop()
  isPart: boolean;

  @Prop({
    type: Schema.Types.ObjectId,
    ref: 'Group'
  })
  group: Group;

  @Prop({
    type: [TaskSchema]
  })
  tasks: Task[];
}

export const TaskSetSchema = SchemaFactory.createForClass(TaskSet);
