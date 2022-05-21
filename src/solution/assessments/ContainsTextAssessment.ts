import { Assessment, AssessmentResult } from './assessment';
import { SerializedAssessmentDto } from '../../dto/serialized-assessment.dto';

export class ContainsTextAssessment implements Assessment {
  constructor(private text: string) {
  }

  run(source: string): AssessmentResult {
    const hasText = source.includes(this.text);
    const score = hasText ? AssessmentResult.MAX_SCORE : AssessmentResult.MIN_SCORE;
    const description = `Код содержит "${this.text}"`;

    return new AssessmentResult(score, description);
  }

  serialize(): SerializedAssessmentDto {
    return {
      type: 'ContainsTextAssessment',
      constructorArguments: [this.text],
    }
  }
}
