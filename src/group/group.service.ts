import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { Group, GroupDocument } from '../schemas/group.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BasicService } from '../utils/BasicService';

export interface RelationOptions {
  relations?: string[];
}

@Injectable()
export class GroupService extends BasicService<GroupDocument, CreateGroupDto, UpdateGroupDto> {
  constructor(
    @InjectModel(Group.name) groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super(groupModel);
  }

  async createWithTeacher(createDto: CreateGroupDto, teacher: UserDocument): Promise<GroupDocument> {
    return this.model.create({ ...createDto, teacher: teacher.id });
  }

  findAll(): Promise<GroupDocument[]> {
    return this.model.find().populate(['teacher', 'students']).exec();
  }

  // findForTeacher(teacher: User): Promise<GroupDocument[]> {
  //   return this.model.find({ id: teacher.groups }).exec();
  // }

  addUser(group: GroupDocument, user: UserDocument) {
    group.update({ $addToSet: { students: user } })
  }

  async addStudents(id: string, studentIds: string[]) {
    const group = await this.findOne(id);
    const addToGroup = group.update({ $addToSet: { students: { $each: studentIds } } }).exec();
    const updateStudents = this.userModel.updateMany({id: studentIds}, { $addToSet: { groups: id } }).exec();

    await Promise.all([addToGroup, updateStudents]);
  }
}
