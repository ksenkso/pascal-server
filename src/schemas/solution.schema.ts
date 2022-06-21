import { Task } from './task.schema';
import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';
import { User } from './user.schema';

export type SolutionDocument = Solution & Document;

@NestSchema()
export class Solution {
  @Prop({ type: Schema.Types.String })
  code: string;

  @Prop({ type: Schema.Types.String })
  output: string;

  @Prop({ type: Schema.Types.Number })
  time: number;

  @Prop({ type: Schema.Types.ObjectId, ref: 'Task' })
  task: Task

  @Prop({ type: Schema.Types.Number })
  score: number;

  @Prop({ type: Schema.Types.ObjectId, ref: 'User' })
  student: User

  @Prop({ type: [Schema.Types.String] })
  messages: string[];

  @Prop({ type: Schema.Types.Boolean })
  successful: boolean;

  @Prop({ type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]})
  comments: Comment[];
}

export const SolutionSchema = SchemaFactory.createForClass(Solution);
