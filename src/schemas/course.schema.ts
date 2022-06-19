import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';
import { ResourceScope } from '../utils/resource-scope.enum';
import { TaskSet, TaskSetSchema } from './task-set.schema';

export type CourseDocument = Course & Document;

@NestSchema()
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Schema.Types.String })
  scope: ResourceScope;

  @Prop({
    type: [TaskSetSchema]
  })
  taskSets: TaskSet[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
