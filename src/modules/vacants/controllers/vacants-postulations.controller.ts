
import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { Create_Postulation_Dto } from '@tesis-project/dev-globals/dist/modules/business/vacants/dto';
import { VacantsPostulationsService } from '../services/vacants-postulations.service';

import { Evaluate_Postulation_Dto } from '@tesis-project/dev-globals/dist/modules/business/vacants/dto/Evaluate-postulation.dto';

@Controller()
export class VacantsPostulationsController {

    constructor(
        private readonly VacantsPostulationsService: VacantsPostulationsService

    ) { }

    @MessagePattern('business.vacant.postulations.create')
    create_postulation(
        @Payload('vacant_id', ParseUUIDPipe) vacant_id: string,
        @Payload('body') Create_Postulation_Dto: Create_Postulation_Dto,
        @Payload('user_auth') user_auth: Auth_User_I_Dto,
    ) {

        return this.VacantsPostulationsService.create_postulation(vacant_id, Create_Postulation_Dto, user_auth);

    }

    @MessagePattern('business.vacant.postulations.delete_one')
    delete_one(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: Auth_User_I_Dto,
    ) {

        return this.VacantsPostulationsService.delete_one(_id, user_auth);

    }

    @MessagePattern('business.vacant.postulations.get_byVacants')
    get_postulations_byVacant(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: Auth_User_I_Dto,
    ) {

        return this.VacantsPostulationsService.get_byVacants(_id, user_auth);

    }

    @MessagePattern('business.vacant.postulations.evaluate')
    evaluate_postulation(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('evaluate') Evaluate_Postulation_Dto: Evaluate_Postulation_Dto,
        @Payload('user_auth') user_auth: Auth_User_I_Dto,
    ) {

        return this.VacantsPostulationsService.evaluate_postulation(_id, Evaluate_Postulation_Dto, user_auth);

    }


}
