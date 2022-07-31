import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { FindUserResponse } from '../types/user/user-response';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserOwnerOrRoleGuard } from '../guards/user-owner-or-role.guard';
import { SetRole } from '../decorators/set-role';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard)
  @SetRole('admin', 'hr')
  async findOne(@Param('id') id: string): Promise<FindUserResponse> {
    return this.userService.findOne(id);
  }
}
