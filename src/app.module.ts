import { Module } from '@nestjs/common';
import { MIKRO_ORM_MODULE_CONFIG } from './database/mikro-orm.module';
import { VacantsModule } from './modules/vacants/vacants.module';
import { ContractsModule } from './modules/contracts/contracts.module';
@Module({
    imports: [
        // MIKRO_ORM_MODULE_CONFIG
        VacantsModule,
        ContractsModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
