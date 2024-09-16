import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContractsService } from './services/contracts.service';

import { Create_PlanningContract_Dto } from '@tesis-project/dev-globals/dist/modules/business/contracts/dto/Create-PlanningContract.dto';
import { Update_DetailsContract_Dto } from '@tesis-project/dev-globals/dist/modules/business/contracts/dto/Update-DetailsContract.dto';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';

@Controller()
export class ContractsController {
    constructor(
        private readonly contractsService: ContractsService
    ) { }

    @MessagePattern('business.vacant.contracts.create')
    create(
        @Payload('body') body: Create_PlanningContract_Dto,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.contractsService.create(body, user_auth);
    }


    @MessagePattern('business.vacant.contracts.update_details')
    update_details(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('body') body: Update_DetailsContract_Dto,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.contractsService.update_details(_id, body, user_auth);
    }

    @MessagePattern('business.vacant.contracts.accept')
    accept(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.contractsService.accept(_id, user_auth);
    }

    @MessagePattern('business.vacant.contracts.get_one')
    get_one(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.contractsService.get_one(_id, user_auth);
    }

    @MessagePattern('business.vacant.contracts.get_all')
    get_all(
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.contractsService.get_all(user_auth);
    }

    @MessagePattern('business.vacant.contracts.generate_doc')
    generate_doc(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.contractsService.generate_doc(_id, user_auth);
    }

    @MessagePattern('business.vacant.contracts.send_proposal')
    send_proposal(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {
        return this.contractsService.send_proposal(_id, user_auth);
    }

}
