import { PartialType } from '@nestjs/mapped-types';
import { CreateVacantDto } from './create-vacant.dto';

export class UpdateVacantDto extends PartialType(CreateVacantDto) {
  id: number;
}
