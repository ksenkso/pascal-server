import { Injectable } from '@nestjs/common';
import { CreateTaskSetDto } from './dto/create-task-set.dto';
import { UpdateTaskSetDto } from './dto/update-task-set.dto';

@Injectable()
export class TaskSetService {
  create(createTaskSetDto: CreateTaskSetDto) {
    return 'This action adds a new taskSet';
  }

  findAll() {
    return `This action returns all taskSet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskSet`;
  }

  update(id: number, updateTaskSetDto: UpdateTaskSetDto) {
    return `This action updates a #${id} taskSet`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskSet`;
  }
}
