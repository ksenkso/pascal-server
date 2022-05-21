import { AssessmentType } from '../schemas/serialized-assessment.schema';

export interface SerializedAssessmentData {
  type: AssessmentType;
  constructorArguments: any[];
}

export class SerializedAssessmentDto implements SerializedAssessmentData {
  type: AssessmentType;
  constructorArguments: any[];
}
