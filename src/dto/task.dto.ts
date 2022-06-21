import { SerializedAssessmentDto } from './serialized-assessment.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTaskDto {
  name: string;
  description: string;
  expectedResult: string;
  assessments?: SerializedAssessmentDto[];
  taskSet: string;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
