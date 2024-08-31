import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../config/envs';
import { NATS_SERVICE } from '../config/services';

const nats_module = [
    ClientsModule.register([
        {
            name: NATS_SERVICE,
            transport: Transport.NATS,
            options: {
                servers: envs.natsServers
            },
        },
    ]),
]

@Module({
    imports: [
        ...nats_module
    ],
    exports: [
        ...nats_module
    ]
})
export class NatsModule {  }
