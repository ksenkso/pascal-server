import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Put
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Request } from 'express';
import { UserDocument } from '../schemas/user.schema';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Req() request: Request) {
    return this.groupService.createWithTeacher(createGroupDto, request.user as any as UserDocument);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id')
  addStudents(@Param('id') id: string, @Body() studentIds: string[]) {
    return this.groupService.addStudents(id, studentIds);
  }
}
