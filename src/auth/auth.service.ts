import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { Role } from './role.enum';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async createUser(userDto: CreateUserDto, roles: Role[] = []): Promise<UserDocument> {
    const created = new this.userModel(userDto);
    created.roles = roles;
    created.setPassword(userDto.password);

    return created.save();
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userModel.findById(changePasswordDto.userId).exec();

    if (!user) {
      throw new NotFoundException(null, 'Пользователь с этим id не найден');
    }

    user.setPassword(changePasswordDto.newPassword);

    await user.save();
  }

  async getByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  async getByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).populate(['groups']).exec();
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.getByEmail(email);
    if (user) {
      const passwordValid = await AuthService.validatePassword(user.password, password);
      if (passwordValid) {
        return user;
      }
    }
  }

  private static async validatePassword(userPassword: string, targetPassword: string): Promise<boolean> {
    return bcrypt.compare(targetPassword, userPassword);
  }
}
