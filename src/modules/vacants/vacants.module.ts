
import { Module } from '@nestjs/common';
import { VacantsService } from './services/vacants.service';
import { VacantsController } from './controllers/vacants.controller';
import { Vacant_Postulations_Repository } from './entities/postulations.repository.service';
import { Vacant_Repository } from './entities/vacant.repository.service';
import { Vacant_Ety } from './entities/vacant.entity';
import { Vacant_Postulations_Ety } from './entities/postulations.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NatsModule } from '../../core/transports/nats.module';
import { VacantsPostulationsService } from './services/vacants-postulations.service';
import { VacantsPostulationsController } from './controllers/vacants-postulations.controller';

@Module({
    controllers: [
        VacantsController,
        VacantsPostulationsController
    ],
    providers: [
        VacantsService,
        VacantsPostulationsService,
        Vacant_Postulations_Repository,
        Vacant_Repository
    ],
    imports: [
        MikroOrmModule.forFeature([
            Vacant_Ety,
            Vacant_Postulations_Ety
        ]),
        NatsModule
    ],
    exports: [

    ]
})
export class VacantsModule { }
