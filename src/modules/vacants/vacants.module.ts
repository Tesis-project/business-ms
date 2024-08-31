import { Module } from '@nestjs/common';
import { VacantsService } from './vacants.service';
import { VacantsController } from './vacants.controller';

@Module({
  controllers: [VacantsController],
  providers: [VacantsService],
})
export class VacantsModule {}
