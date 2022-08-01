import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserResponse } from '../types/user/user-response';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserOwnerOrRoleGuard } from '../common/guards/user-owner-or-role.guard';
import { SetRole } from '../common/decorators/set-role';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

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
}
