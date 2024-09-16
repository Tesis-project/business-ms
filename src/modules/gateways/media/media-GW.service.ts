

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Media_I } from '@tesis-project/dev-globals/dist/modules/media/interfaces';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';

import { Create_Media_Dto } from '@tesis-project/dev-globals/dist/modules/media/dto';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { NATS_SERVICE } from '../../../core/config/services';

@Injectable()
export class MediaService_GW {


    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {

    }

    async get_mediaMeta(_id: string): Promise<_Response_I<Media_I>> {

        const resp = await firstValueFrom<_Response_I<Media_I>>(
            this.client.send('media.get_meta.file', {
                _id,
            })
        )
        return resp

    }

    async create_media(file: Express.Multer.File, Create_Media_Dto: Create_Media_Dto, user_auth: Auth_User_I_Dto): Promise<_Response_I<Media_I>> {

        const resp = await firstValueFrom<_Response_I<Media_I>>(
            this.client.send('media.create.single', {
                file: file,
                data: {
                    ...Create_Media_Dto,
                },
                user_auth,
            })
        )
        return resp

    }

    async delete_media(_id: string, user_auth: Auth_User_I_Dto): Promise<_Response_I> {

        const resp = await firstValueFrom<_Response_I>(
            this.client.send('media.delete.single', {
                _id,
                user_auth,
            })
        )
        return resp

    }

    async update_media(_id: string, file: Express.Multer.File, user_auth: Auth_User_I_Dto): Promise<_Response_I<Media_I>> {

        const resp = await firstValueFrom<_Response_I<Media_I>>(
            this.client.send('media.update.single', {
                _id,
                file,
                user_auth,
            })
        )
        return resp

    }

}
