import { Controller, Post, Body, Patch, Param, UsePipes, UseGuards, Get } from '@nestjs/common';
import { StudentService } from './student.service';
import { ImportStudentDto } from './dto/import-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ArrayValidationPipe } from '../common/pipes/ArrayValidationPipe';
import { CreateStudentsResponse, GetStudentResponse, GetStudentsResponse } from '../types';
import { CompletionStudentDto } from './dto/completion-student.dto';
import { SetRole } from '../common/decorators/set-role';
import { UserOwnerOrRoleGuard } from '../common/guards/user-owner-or-role.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';

@Controller('/api/user')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('/student')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetRole('admin', 'hr')
  async findAll(): Promise<GetStudentsResponse> {
    return this.studentService.findAll();
  }

  @Get('/:id/student')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard)
  @SetRole('admin', 'hr')
  async findOne(@Param('id') id: string): Promise<GetStudentResponse> {
    return this.studentService.findOne(id);
  }

  @Post('/student')
  @SetRole('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(ArrayValidationPipe(ImportStudentDto))
  async create(@Body() createUserDto: ImportStudentDto[]): Promise<CreateStudentsResponse> {
    return this.studentService.importStudents(createUserDto);
  }

  @Patch('/student/:userToken')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard)
  completeSignup(
    @Param('userToken') userToken: string,
    @Body() updateUserDto: CompletionStudentDto,
  ) {
    return this.studentService.completeSignup(userToken, updateUserDto);
  }

  @Patch('/:id/student')
  @SetRole('admin')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }
}
