import { Injectable } from '@nestjs/common';
import { CreateVacantDto } from './dto/create-vacant.dto';
import { UpdateVacantDto } from './dto/update-vacant.dto';

@Injectable()
export class VacantsService {
  create(createVacantDto: CreateVacantDto) {
    return 'This action adds a new vacant';
  }

  findAll() {
    return `This action returns all vacants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vacant`;
  }

  update(id: number, updateVacantDto: UpdateVacantDto) {
    return `This action updates a #${id} vacant`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacant`;
  }
}
