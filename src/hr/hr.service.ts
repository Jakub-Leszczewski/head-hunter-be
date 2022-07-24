import { Injectable } from '@nestjs/common';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';

@Injectable()
export class HrService {
  create(createHrDto: CreateHrDto) {
    return 'This action adds a new hr';
  }

  findAll() {
    return `This action returns all hr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hr`;
  }

  update(id: number, updateHrDto: UpdateHrDto) {
    return `This action updates a #${id} hr`;
  }

  remove(id: number) {
    return `This action removes a #${id} hr`;
  }
}
