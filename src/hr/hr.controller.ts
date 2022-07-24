import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HrService } from './hr.service';
import { CreateHrDto } from './dto/create-hr.dto';
import { CompletionHrDto } from './dto/completion-hr.dto';

@Controller('/api/user')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Post('/hr')
  async importHr(@Body() createHrDto: CreateHrDto) {
    return this.hrService.importHr(createHrDto);
  }

  @Patch('/hr/:userToken')
  async completeSignup(
    @Param('userToken') userToken: string,
    @Body() completionHrDto: CompletionHrDto,
  ): Promise<any> {
    return this.hrService.completeSignup(userToken, completionHrDto);
  }
}
