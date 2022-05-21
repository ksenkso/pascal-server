import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SerializedAssessment, SerializedAssessmentSchema } from './serialized-assessment.schema';

export type TaskDocument = Task & Document;

@NestSchema()
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  expectedResult: string;

  @Prop({
    required: true,
    type: [SerializedAssessmentSchema],
  })
  assessments: SerializedAssessment[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);

