import { Module } from '@nestjs/common';
import { TaskSetService } from './task-set.service';
import { TaskSetController } from './task-set.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSet, TaskSetSchema } from '../schemas/task-set.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TaskSet.name, schema: TaskSetSchema }])],
  controllers: [TaskSetController],
  providers: [TaskSetService]
})
export class TaskSetModule {}
