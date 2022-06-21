import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Solution, SolutionSchema } from '../schemas/solution.schema';
import { Comment, CommentSchema } from '../schemas/comment.schema';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    MongooseModule.forFeature([
      { name: Solution.name, schema: SolutionSchema },
      { name: Comment.name, schema: CommentSchema },
    ])
  ]
})
export class CommentModule {}
