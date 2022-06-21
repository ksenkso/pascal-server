import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../schemas/task.schema';
import { SolutionController } from './solution.controller';
import { SolutionService } from './solution.service';
import { Solution, SolutionSchema } from '../schemas/solution.schema';
import { Comment, CommentSchema } from '../schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Solution.name, schema: SolutionSchema },
      { name: Comment.name, schema: CommentSchema },
    ])
  ],
  controllers: [SolutionController],
  providers: [SolutionService]
})
export class SolutionModule {
}
