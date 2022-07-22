import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ArrayValidationPipe } from '../pipes/ArrayValidationPipe';
import { CreateStudentsResponse } from '../types';
import { StudentService } from './student.service';
import { HrService } from './hr.service';
import { SignupCompletionStudentDto } from './dto/signup-completion-student.dto';

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly hrService: HrService,
  ) {}

  @Post('/student')
  @UsePipes(ArrayValidationPipe(CreateStudentDto))
  async create(
    @Body() createUserDto: CreateStudentDto[],
  ): Promise<CreateStudentsResponse> {
    return this.studentService.studentsImport(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('/student/:userToken')
  completeSignup(
    @Param('userToken') userToken: string,
    @Body() updateUserDto: SignupCompletionStudentDto,
  ) {
    return this.studentService.completeSignup(userToken, updateUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateStudentDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
