import { Controller, Get, Param, UseGuards, Patch, Body, Query, Delete } from '@nestjs/common';
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
import { FindAllQueryDto } from '../student/dto/find-all-query.dto';
import { ChangeEmployedStatusGuard } from '../common/guards/change-employed-status.guard';
import { ChangeStatusInterviewDto } from '../hr/dto/change-status-interview.dto';
import { OnlyActiveUserGuard } from '../common/guards/only-active-user.guard';
import { InterviewService } from '../hr/interview.service';
import { ChangeInterviewGuard } from '../common/guards/change-interview.guard';
import { HrMaxInterviewGuard } from '../common/guards/hr-max-interview.guard';
import { StudentNotEmployedGuard } from '../common/guards/student-not-employed.guard';

@Controller('/api/user')
@UseGuards(JwtAuthGuard, OnlyActiveUserGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private studentService: StudentService,
    private interviewService: InterviewService,
  ) {}

  @Get(':id')
  @UseGuards(UserOwnerGuard)
  @SetRole('admin')
  async findOne(@Param('id') id: string): Promise<GetUserResponse> {
    return this.userService.findOne(id);
  }

  @Get('/:id/student')
  @UseGuards(UserOwnerGuard, StudentNotEmployedGuard)
  @SetRole('admin', 'hr')
  async findOneStudent(@Param('id') id: string): Promise<GetStudentResponse> {
    return this.studentService.findOne(id);
  }

  @Get('/:id/hr/student')
  @UseGuards(UserOwnerGuard)
  @SetRole('admin')
  async findStudentsAtInterview(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto,
  ): Promise<GetStudentsResponse> {
    return this.interviewService.findAllHrInterview(id, query);
  }

  @Patch('/:id/student')
  @SetRole('admin')
  @UseGuards(UserOwnerGuard, StudentNotEmployedGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Patch('/:id/student/interview')
  @UseGuards(ChangeInterviewGuard, HrMaxInterviewGuard, StudentNotEmployedGuard)
  @SetRole('admin')
  async createInterview(
    @Param('id') id: string,
    @Body() changeStatusInterviewDto: ChangeStatusInterviewDto,
  ) {
    return this.interviewService.createInterview(id, changeStatusInterviewDto);
  }

  @Delete('/:id/student/interview')
  @UseGuards(ChangeInterviewGuard, StudentNotEmployedGuard)
  @SetRole('admin')
  async removeInterview(
    @Param('id') id: string,
    @Body() changeStatusInterviewDto: ChangeStatusInterviewDto,
  ) {
    return this.interviewService.removeInterview(id, changeStatusInterviewDto);
  }

  @Patch('/:id/student/employed')
  @UseGuards(ChangeEmployedStatusGuard, StudentNotEmployedGuard)
  @SetRole('admin')
  async changeEmployedStatus(@Param('id') id: string) {
    return this.studentService.changeEmployedStatus(id);
  }
}
