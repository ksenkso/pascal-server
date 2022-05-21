import { SerializedAssessmentDto } from './serialized-assessment.dto';

export class CreateTaskDto {
  name: string;
  description: string;
  expectedResult: string;
  assessments?: SerializedAssessmentDto[];
}
