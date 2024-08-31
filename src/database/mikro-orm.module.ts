import { MikroOrmModule } from "@mikro-orm/nestjs";
import config from '../../mikro-orm.config';


export const MIKRO_ORM_MODULE_CONFIG = MikroOrmModule.forRoot(config);

