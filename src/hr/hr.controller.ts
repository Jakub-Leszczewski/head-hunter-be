import { Controller, Post, Body, Patch, Param, UseGuards, Inject } from '@nestjs/common';
import { HrService } from './hr.service';
import { CreateHrDto } from './dto/create-hr.dto';
import { CompletionHrDto } from './dto/completion-hr.dto';
import { SetRole } from '../common/decorators/set-role';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { UserOwnerGuard } from '../common/guards/user-owner.guard';
import { CompletionSignupHrResponse } from '../types';

@Controller('/hr')
export class HrController {
  constructor(@Inject(HrService) private hrService: HrService) {}

  @Post('/')
  @SetRole('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async importHr(@Body() createHrDto: CreateHrDto) {
    return this.hrService.importHr(createHrDto);
  }

  @Patch('/:userToken')
  async completeSignup(
    @Param('userToken') userToken: string,
    @Body() completionHrDto: CompletionHrDto,
  ): Promise<CompletionSignupHrResponse> {
    return this.hrService.completeSignup(userToken, completionHrDto);
  }
}
