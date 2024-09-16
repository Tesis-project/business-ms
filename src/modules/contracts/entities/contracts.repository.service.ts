import { EntityRepository, EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Pagination_I, pagination_meta } from "@tesis-project/dev-globals/dist/core/helpers";
import { _Process_Save_I, _Find_Many_I, _Process_Delete_I, _Process_Update_I } from "@tesis-project/dev-globals/dist/core/interfaces";

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';
import { Contract_Ety } from "./contract.entity";

@Injectable()
export class Contract_Repository extends EntityRepository<Contract_Ety> {

    constructor(
        em: EntityManager,
    ) {
        super(em.fork(), Contract_Ety);
    }

    async create_contract({ save, _em }: _Process_Save_I<Contract_Ety>): Promise<Contract_Ety> {

        const new_contract = await _em.create(Contract_Ety, save);
        await _em.persist(new_contract);
        return new_contract;

    }

    async find_all({ find, options, _em }: _Find_Many_I<Contract_Ety, 'Contract_Ety'>, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<Contract_Ety>> {

        if (!Pagination_Dto) {
            return {
                data: await this.find( find, options ),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(Contract_Ety, find);

        const data = await _em.find(Contract_Ety, find, {
            ...options,
            limit,
            offset: (page - 1) * limit,
        });

        const meta: Pagination_I['meta'] = pagination_meta(page, limit, totalRecords);

        return {
            data,
            meta
        }

    }

    async delete_contract({ find, _em }: _Process_Delete_I<Contract_Ety>): Promise<boolean> {

        const contract_postulation_find = await this.findOne( find );

        if (!contract_postulation_find) {
            throw new Error('contract not found');
        }

        await _em.nativeDelete(Contract_Ety, {
            _id: contract_postulation_find._id
        });
        return true;

    }

    async update_contract({ find, update, _em }: _Process_Update_I<Contract_Ety>): Promise<Contract_Ety> {

        const contract_postulation_find = await this.findOne(find );

        if (!contract_postulation_find) {
            throw new Error('contract not found');
        }

        Object.assign(contract_postulation_find, update);
        await _em.persist(contract_postulation_find);
        return contract_postulation_find;

    }


}
