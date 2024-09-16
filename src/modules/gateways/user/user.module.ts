
import { Global, Module } from "@nestjs/common";
import { NatsModule } from "../../../core/transports/nats.module";
import { UserService_GW } from "./user-GW.service";


@Global()
@Module({
    imports: [
        NatsModule
    ],
    providers: [
        UserService_GW
    ],
    exports: [
        UserService_GW
    ]
})
export class UserModule_GW { }
