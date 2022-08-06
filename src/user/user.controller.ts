import { Controller, Get, Param, UseGuards, Patch, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserResponse, GetStudentResponse } from '../types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserOwnerOrRoleGuard } from '../common/guards/user-owner-or-role.guard';
import { SetRole } from '../common/decorators/set-role';
import { UpdateStudentDto } from '../student/dto/update-student.dto';
import { StudentService } from '../student/student.service';
import { HrService } from '../hr/hr.service';
import { FindAllQueryDto } from '../student/dto/find-all-query.dto';
import { UserObj } from '../common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { ChangeStudentStatusGuard } from '../common/guards/change-student-status.guard';

@Controller('/api/user')
export class UserController {
  constructor(
    private userService: UserService,
    private studentService: StudentService,
    private hrService: HrService,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard)
  @SetRole('admin')
  async findOne(@Param('id') id: string): Promise<GetUserResponse> {
    return this.userService.findOne(id);
  }

  @Get('/:id/student')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard)
  @SetRole('admin', 'hr')
  async findOneStudent(@Param('id') id: string): Promise<GetStudentResponse> {
    return this.studentService.findOne(id);
  }

  @Patch('/:id/student/status')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard, ChangeStudentStatusGuard)
  @SetRole('admin', 'hr')
  async changeStudentStatus(@Param('id') id: string, @UserObj() user: User) {
    return this.studentService.changeStatus(id);
  }

  @Get('/:id/hr/student')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard)
  @SetRole('admin')
  async findStudentsAtInterview(
    @Param('id') id: string,
    @Query() query: FindAllQueryDto,
  ): Promise<any> {
    return this.hrService.findStudentsAtInterview(id, query);
  }

  @Patch('/:id/student')
  @SetRole('admin')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }
}
