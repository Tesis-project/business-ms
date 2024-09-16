import { Module } from '@nestjs/common';
import { ContractsService } from './services/contracts.service';
import { ContractsController } from './contracts.controller';
import { Contract_Repository } from './entities/contracts.repository.service';
import { NatsModule } from '../../core/transports/nats.module';
import { Contract_Ety } from './entities/contract.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { VacantsModule } from '../vacants/vacants.module';
import {  ContractsHelpersService } from './services/contracts.helpers';
import { contracts_extraServices } from './services/contracts-extraServices';

@Module({
    controllers: [ContractsController],
    providers: [
        ContractsService,
        Contract_Repository,
        ContractsHelpersService,
        contracts_extraServices
    ],
    imports: [
        MikroOrmModule.forFeature([
            Contract_Ety,
        ]),
        NatsModule
    ]
})
export class ContractsModule { }

