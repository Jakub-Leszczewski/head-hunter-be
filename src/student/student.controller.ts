import { Controller, Post, Body, Patch, Param, UsePipes, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { ImportStudentDto } from './dto/import-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ArrayValidationPipe } from '../pipes/ArrayValidationPipe';
import { CreateStudentsResponse } from '../types';
import { CompletionStudentDto } from './dto/completion-student.dto';
import { SetRole } from '../decorators/set-role';
import { UserOwnerGuard } from '../guards/user-owner.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('/api/user')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/student')
  @UsePipes(ArrayValidationPipe(ImportStudentDto))
  async create(@Body() createUserDto: ImportStudentDto[]): Promise<CreateStudentsResponse> {
    return this.studentService.importStudents(createUserDto);
  }

  @Patch('/student/:userToken')
  completeSignup(
    @Param('userToken') userToken: string,
    @Body() updateUserDto: CompletionStudentDto,
  ) {
    return this.studentService.completeSignup(userToken, updateUserDto);
  }

  @Patch(':id/student')
  @SetRole('admin', 'user')
  @UseGuards(JwtAuthGuard, UserOwnerGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }
}
