import { Controller, Post, Body, Patch, Param, UsePipes } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ArrayValidationPipe } from '../pipes/ArrayValidationPipe';
import { CreateStudentsResponse } from '../types';
import { CompletionStudentDto } from './dto/completion-student.dto';

@Controller('/api/user')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/student')
  @UsePipes(ArrayValidationPipe(CreateStudentDto))
  async create(@Body() createUserDto: CreateStudentDto[]): Promise<CreateStudentsResponse> {
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
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }
}
