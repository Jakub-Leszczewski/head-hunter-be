import { Controller, Get, Param, UseGuards, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserResponse } from '../types/user/user-response';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserOwnerOrRoleGuard } from '../common/guards/user-owner-or-role.guard';
import { SetRole } from '../common/decorators/set-role';
import { GetStudentResponse } from '../types';
import { UpdateStudentDto } from '../student/dto/update-student.dto';
import { StudentService } from '../student/student.service';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService, private studentService: StudentService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

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

  @Patch('/:id/student')
  @SetRole('admin')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }
}
