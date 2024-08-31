import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VacantsService } from './vacants.service';
import { CreateVacantDto } from './dto/create-vacant.dto';
import { UpdateVacantDto } from './dto/update-vacant.dto';

@Controller()
export class VacantsController {
  constructor(private readonly vacantsService: VacantsService) {}

  @MessagePattern('createVacant')
  create(@Payload() createVacantDto: CreateVacantDto) {
    return this.vacantsService.create(createVacantDto);
  }

  @MessagePattern('findAllVacants')
  findAll() {
    return this.vacantsService.findAll();
  }

  @MessagePattern('findOneVacant')
  findOne(@Payload() id: number) {
    return this.vacantsService.findOne(id);
  }

  @MessagePattern('updateVacant')
  update(@Payload() updateVacantDto: UpdateVacantDto) {
    return this.vacantsService.update(updateVacantDto.id, updateVacantDto);
  }

  @MessagePattern('removeVacant')
  remove(@Payload() id: number) {
    return this.vacantsService.remove(id);
  }
}
