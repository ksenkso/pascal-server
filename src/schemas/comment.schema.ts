import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';
import { User } from './user.schema';
import { Solution } from './solution.schema';

export type CommentDocument = Comment & Document;

@NestSchema()
export class Comment {
  @Prop({ type: Schema.Types.String })
  message: string;

  @Prop({ type: Schema.Types.ObjectId, ref: 'Solution' })
  solution: Solution

  @Prop({ type: Schema.Types.ObjectId, ref: 'User' })
  user: User
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
