import { Schema as NestSchema } from '@nestjs/mongoose/dist/decorators/schema.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';
import { Assessment } from '../solution/assessments/assessment';
import { NumberOfLinesAssessment } from '../solution/assessments/NumberOfLinesAssessment';
import { SerializedAssessmentData } from '../dto/serialized-assessment.dto';
import { ContainsTextAssessment } from '../solution/assessments/ContainsTextAssessment';

export type AssessmentType = 'NumberOfLinesAssessment' | 'ContainsTextAssessment';

@NestSchema()
export class SerializedAssessment implements SerializedAssessmentData {
  @Prop({ required: true, type: Schema.Types.String })
  type: AssessmentType;

  @Prop({
    required: true,
    type: Schema.Types.Mixed
  })
  constructorArguments: any[];
}

export class AssessmentFactory {
  static createAssessment(data: SerializedAssessmentData): Assessment {
    switch (data.type) {
      case 'NumberOfLinesAssessment':
        return new NumberOfLinesAssessment(data.constructorArguments[0]);
      case 'ContainsTextAssessment':
        return new ContainsTextAssessment(data.constructorArguments[0]);
    }
  }
}

export const SerializedAssessmentSchema = SchemaFactory.createForClass(SerializedAssessment);
export type SerializedAssessmentDocument = SerializedAssessment & Document;
