import { Controller, Get, Param, UseGuards, Patch, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  GetUserResponse,
  GetStudentResponse,
  ChangeStudentStatusResponse,
  GetStudentsResponse,
} from '../types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserOwnerGuard } from '../common/guards/user-owner.guard';
import { SetRole } from '../common/decorators/set-role';
import { UpdateStudentDto } from '../student/dto/update-student.dto';
import { StudentService } from '../student/student.service';
import { HrService } from '../hr/hr.service';
import { FindAllQueryDto } from '../student/dto/find-all-query.dto';
import { ChangeStudentStatusGuard } from '../common/guards/change-student-status.guard';
import { ChangeStatusDto } from '../student/dto/change-status.dto';

@Controller('/api/user')
export class UserController {
  constructor(
    private userService: UserService,
    private studentService: StudentService,
    private hrService: HrService,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, UserOwnerGuard)
  @SetRole('admin')
  async findOne(@Param('id') id: string): Promise<GetUserResponse> {
    return this.userService.findOne(id);
  }

  @Get('/:id/student')
  @UseGuards(JwtAuthGuard, UserOwnerGuard)
  @SetRole('admin', 'hr')
  async findOneStudent(@Param('id') id: string): Promise<GetStudentResponse> {
    return this.studentService.findOne(id);
  }

  @Patch('/:id/student/status')
  @UseGuards(JwtAuthGuard, ChangeStudentStatusGuard)
  @SetRole('admin')
  async changeStudentStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ): Promise<ChangeStudentStatusResponse> {
    return this.studentService.changeStatus(id, changeStatusDto);
  }

  @Get('/:id/hr/student')
  @UseGuards(JwtAuthGuard, UserOwnerGuard)
  @SetRole('admin')
  async findStudentsAtInterview(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto,
  ): Promise<GetStudentsResponse> {
    return this.hrService.findStudentsAtInterview(id, query);
  }

  @Patch('/:id/student')
  @SetRole('admin')
  @UseGuards(JwtAuthGuard, UserOwnerGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }
}
