import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { Model } from 'mongoose';
import { Solution, SolutionDocument } from '../schemas/solution.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Solution.name) private solutionModel: Model<SolutionDocument>,
  ) {
  }

  async create(createCommentDto: CreateCommentDto) {
    const created = await this.commentModel.create(createCommentDto);
    await this.solutionModel.findById(createCommentDto.solution).update({ $addToSet: { comments: created._id } }).exec();
    await created.populate(['solution', 'user'])

    return created;

  }
}
