import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HrService } from './hr.service';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';

@Controller('/api/user')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Post('/hr')
  async create(@Body() createHrDto: CreateHrDto) {
    return this.hrService.create(createHrDto);
  }

  @Patch('/hr/:userToken')
  async completeSignup(
    @Param('userToken') userToken: string,
    @Body() updateHrDto: UpdateHrDto,
  ): Promise<any> {}
}
