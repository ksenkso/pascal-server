import { Body, Controller, Param, Post } from '@nestjs/common';
import { Solution, SolutionService } from './solution.service';

@Controller('solution')
export class SolutionController {
  constructor(private solutionService: SolutionService) {
  }

  @Post(':taskId')
  checkSolution(@Param('taskId') taskId: string, @Body() solution: Solution) {
    console.log(solution);
    return this.solutionService.checkSolution(solution, taskId);
  }
}
