import { PartialType } from '@nestjs/mapped-types';

export class CreateSolutionDto {
  code: string;
  time: number;
  task: string;
  student: string;
}

export class UpdateSolutionDto extends PartialType(CreateSolutionDto) {
}
