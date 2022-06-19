import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';
import { User } from './user.schema';
import { TaskSet, TaskSetSchema } from './task-set.schema';
import { Course, CourseSchema } from './course.schema';

export type GroupDocument = Group & Document;

@NestSchema()
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: Schema.Types.ObjectId,
    ref: 'User'
  })
  teacher: User;

  @Prop({
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  })
  students: User[];

  @Prop({
    type: [CourseSchema]
  })
  courses: Course[];

  @Prop({
    type: [TaskSetSchema]
  })
  taskSets: TaskSet[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
