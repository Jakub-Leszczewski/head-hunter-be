import { Controller, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { CreateHrDto } from './dto/create-hr.dto';
import { CompletionHrDto } from './dto/completion-hr.dto';
import { SetRole } from '../decorators/set-role';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { UserOwnerOrRoleGuard } from '../guards/user-owner-or-role.guard';

@Controller('/api/user')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Post('/hr')
  @SetRole('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async importHr(@Body() createHrDto: CreateHrDto) {
    return this.hrService.importHr(createHrDto);
  }

  @Patch('/hr/:userToken')
  @UseGuards(JwtAuthGuard, UserOwnerOrRoleGuard)
  async completeSignup(
    @Param('userToken') userToken: string,
    @Body() completionHrDto: CompletionHrDto,
  ): Promise<any> {
    return this.hrService.completeSignup(userToken, completionHrDto);
  }
}
