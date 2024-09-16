import { Module } from '@nestjs/common';
import { MIKRO_ORM_MODULE_CONFIG } from './database/mikro-orm.module';
import { VacantsModule } from './modules/vacants/vacants.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { MediaModule } from './modules/gateways/media';
import { UserModule_GW } from './modules/gateways/user/user.module';

@Module({
    imports: [
        MIKRO_ORM_MODULE_CONFIG,
        VacantsModule,
        ContractsModule,
        MediaModule,
        UserModule_GW
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
