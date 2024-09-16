

import { Inject, Injectable } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"
import { _Response_I } from "@tesis-project/dev-globals/dist/core/interfaces"
import { Payment_Account_I, User_I } from "@tesis-project/dev-globals/dist/modules/user/interfaces"
import { firstValueFrom } from "rxjs"
import { NATS_SERVICE } from "../../../core/config/services"


@Injectable()
export class UserService_GW {


    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {

    }

    async get_user(_id: string): Promise<_Response_I<User_I>> {

        const resp = await firstValueFrom<_Response_I<User_I>>(
            this.client.send('user.get_oneProfile', _id)
        )

        return resp

    }

    async get_bankInfo(_id: string): Promise<_Response_I<Payment_Account_I>> {

        const resp = await firstValueFrom<_Response_I<Payment_Account_I>>(
            this.client.send('user.hiring_data.bank.find_one', {
                _id
            })
        )

        return resp

    }


}