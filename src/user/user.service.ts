import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { Role } from '../auth/role.enum';
import { BasicService } from '../utils/BasicService';
import { RelationOptions } from '../group/group.service';



@Injectable()
export class UserService extends BasicService<UserDocument, CreateUserDto, UpdateUserDto> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  async create(userDto: CreateUserDto, roles: Role[] = []): Promise<UserDocument> {
    const created = new this.userModel(userDto);
    created.roles = roles;
    created.setPassword(userDto.password);

    return created.save();
  }

  async getByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  findAll() {
    return super.findAll({ relations: ['groups'] });
  }

  findOne(id: string): Promise<UserDocument | undefined> {
    return super.findOne(id, { relations: ['groups'] });
  }

  findByRole(role: string, options?: RelationOptions) {
    const query = this.userModel.find({ roles: { $in: [role] } });

    this.populate(query, options);

    return query.exec();
  }
}
