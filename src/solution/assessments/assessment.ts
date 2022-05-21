import { SerializedAssessment } from '../../schemas/serialized-assessment.schema';

export interface Assessment {
  run(source: string): AssessmentResult;

  serialize(): SerializedAssessment;
}

export class AssessmentResult {
  static MAX_SCORE = 5;
  static MIN_SCORE = 0;

  score: number;
  description: string;

  constructor(score: number, description: string) {
    this.score = Math.max(Math.min(AssessmentResult.MAX_SCORE, score), AssessmentResult.MIN_SCORE);
    this.description = description;
  }
}
