import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Delete()
  delete() {
    return this.tasksService.clear();
  }
}
