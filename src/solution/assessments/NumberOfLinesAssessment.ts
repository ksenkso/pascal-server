import { Assessment, AssessmentResult } from './assessment';
import { SerializedAssessmentDto } from '../../dto/serialized-assessment.dto';

export class NumberOfLinesAssessment implements Assessment {
  constructor(private readonly breaks: Record<number, number>) {
  }

  run(source: string): AssessmentResult {
    const sourceNumberOfLines = source.trim().split('\n').length;
    const score = +Object.keys(this.breaks).sort((a, b) => this.breaks[a] > this.breaks[b] ? 1 : -1).find((numberOfLines) => {
      return sourceNumberOfLines <= this.breaks[numberOfLines];
    });
    const breakpoint = this.breaks[score];
    const description = `Количество строк <= ${breakpoint} (${sourceNumberOfLines})`;

    return new AssessmentResult(score, description);
  }

  serialize(): SerializedAssessmentDto {
    return {
      type: 'NumberOfLinesAssessment',
      constructorArguments: [this.breaks],
    }
  }
}
