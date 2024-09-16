import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VacantsService } from '../services/vacants.service';

import { Create_Vacant_Dto } from '@tesis-project/dev-globals/dist/modules/business/vacants/dto/Create-vacant.dto';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';

import { Search_Vacant_Dto } from '@tesis-project/dev-globals/dist/modules/business/vacants/dto';


@Controller()
export class VacantsController {

    constructor(
        private readonly vacantsService: VacantsService
    ) { }

    @MessagePattern('business.vacant.create_vacant')
    create(
        @Payload('file') file: Express.Multer.File,
        @Payload('user_auth') user_auth: Auth_User_I_Dto,
        @Payload('body') createVacantDto: Create_Vacant_Dto,
    ) {

        return this.vacantsService.create_vacant(file, createVacantDto, user_auth);

    }

    @MessagePattern('business.vacant.get_vacant')
    get_one_vacant(
        @Payload('_id', ParseUUIDPipe) _id: string,
    ) {

        return this.vacantsService.get_one_vacant(_id);

    }

    @MessagePattern('business.vacant.get_all_own')
    get_all_own(
        @Payload('user_auth') user_auth: Auth_User_I_Dto,
    ) {

        return this.vacantsService.get_all_own(user_auth);

    }

    @MessagePattern('business.vacant.get_all_public')
    get_all_public(
        @Payload('type') Search_Vacant_Dto: Search_Vacant_Dto
    ) {

        return this.vacantsService.get_all_public(Search_Vacant_Dto);

    }

    @MessagePattern('business.vacant.delete_one')
    delete_one(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: Auth_User_I_Dto,
    ) {

        return this.vacantsService.delete_one(_id, user_auth);

    }

}
