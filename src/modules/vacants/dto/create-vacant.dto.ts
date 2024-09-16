
import {Create_Vacant_Dto} from '@tesis-project/dev-globals/dist/modules/business/vacants/dto/Create-vacant.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';


export class Body_Create_Vacant_Dto {

    @ValidateNested()
    @Type(() => Create_Vacant_Dto)
    body: Create_Vacant_Dto;

}
