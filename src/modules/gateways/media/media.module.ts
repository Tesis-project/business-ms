
import { Global, Module } from '@nestjs/common';
import { MediaService_GW } from './media-GW.service';
import { NatsModule } from '../../../core/transports/nats.module';

@Global()
@Module({
    imports: [
        NatsModule
    ],
    providers: [
        MediaService_GW
    ],
    exports: [
        MediaService_GW
    ]
})
export class MediaModule { }
