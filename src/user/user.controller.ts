import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { FindUserResponse } from '../types/user/user-response';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindUserResponse> {
    return this.userService.findOne(id);
  }
}
