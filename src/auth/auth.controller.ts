import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateUserDto } from '../dto/user.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { LoginGuard } from '../guards/login.guard';
import { Role } from './role.enum';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post('/register-student')
  async registerStudent(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto, [Role.Student]);
  }

  @Post('/register-teacher')
  async registerTeacher(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto, [Role.Teacher]);
  }

  @Post('/register-admin')
  async registerAdmin(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto, [Role.Admin]);
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  async login(@Request() request) {
    return request.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/logout')
  async logout(@Request() request) {
    return request.logOut();
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
