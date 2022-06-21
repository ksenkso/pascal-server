import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SolutionService } from './solution.service';
import { CreateSolutionDto } from '../dto/solution.dto';

@Controller('solution')
export class SolutionController {
  constructor(private solutionService: SolutionService) {
  }

  @Post('/')
  checkSolution(@Body() solution: CreateSolutionDto) {
    console.log(solution);
    return this.solutionService.checkSolution(solution);
  }

  @Get('/user/:userId')
  getForUser(@Param('userId') userId: string) {
    return this.solutionService.getForUser(userId);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.solutionService.findOne(id, { relations: ['task', 'student', 'comments', { path: 'comments', populate: ['user', 'solution'] }] });
  }
}
