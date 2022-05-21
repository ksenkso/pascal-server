import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../schemas/task.schema';
import { SolutionController } from './solution.controller';
import { SolutionService } from './solution.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema }
    ])
  ],
  controllers: [SolutionController],
  providers: [SolutionService]
})
export class SolutionModule {
}
