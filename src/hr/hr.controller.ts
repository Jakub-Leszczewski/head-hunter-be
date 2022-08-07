import { Controller, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { CreateHrDto } from './dto/create-hr.dto';
import { CompletionHrDto } from './dto/completion-hr.dto';
import { SetRole } from '../common/decorators/set-role';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { UserOwnerGuard } from '../common/guards/user-owner.guard';

@Controller('/api/hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Post('/')
  @SetRole('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async importHr(@Body() createHrDto: CreateHrDto) {
    return this.hrService.importHr(createHrDto);
  }

  @Patch('/:userToken')
  @UseGuards(JwtAuthGuard, UserOwnerGuard)
  async completeSignup(
    @Param('userToken') userToken: string,
    @Body() completionHrDto: CompletionHrDto,
  ): Promise<any> {
    return this.hrService.completeSignup(userToken, completionHrDto);
  }
}
