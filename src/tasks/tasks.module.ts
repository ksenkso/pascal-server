import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../schemas/task.schema';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import {
  SerializedAssessment,
  SerializedAssessmentSchema
} from '../schemas/serialized-assessment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: SerializedAssessment.name, schema: SerializedAssessmentSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
