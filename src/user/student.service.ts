import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentsResponse } from '../types';
import { UserService } from './user.service';

@Injectable()
export class StudentService {
  constructor(private readonly userService: UserService) {}

  async create(
    createUserDto: CreateStudentDto[],
  ): Promise<CreateStudentsResponse> {
    return 'This action adds a new user' as any;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateStudentDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
