import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskSetService } from './task-set.service';
import { CreateTaskSetDto } from './dto/create-task-set.dto';
import { UpdateTaskSetDto } from './dto/update-task-set.dto';
import { UpdateWriteOpResult } from 'mongoose';

@Controller('task-set')
export class TaskSetController {
  constructor(private readonly taskSetService: TaskSetService) {}

  @Post()
  create(@Body() createTaskSetDto: CreateTaskSetDto) {
    return this.taskSetService.create(createTaskSetDto);
  }

  @Get()
  findAll() {
    return this.taskSetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskSetService.findOne(id, { relations: ['tasks', 'group'] });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskSetDto: UpdateTaskSetDto): Promise<UpdateWriteOpResult> {
    return this.taskSetService.update(id, updateTaskSetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskSetService.remove(id);
  }

  @Get('/group/:id')
  findForGroup(@Param('id') id: string) {
    return this.taskSetService.findForGroup(id);
  }
}
