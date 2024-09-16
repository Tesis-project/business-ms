import { EntityRepository, EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Pagination_I, pagination_meta } from "@tesis-project/dev-globals/dist/core/helpers";
import { _Process_Save_I, _Find_Many_I, _Process_Delete_I, _Process_Update_I } from "@tesis-project/dev-globals/dist/core/interfaces";
import { Vacant_Postulations_Ety } from "./postulations.entity";

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';

@Injectable()
export class Vacant_Postulations_Repository extends EntityRepository<Vacant_Postulations_Ety> {

    constructor(
        em: EntityManager,
    ) {
        super(em.fork(), Vacant_Postulations_Ety);
    }

    async create_VacantPostulation({ save, _em }: _Process_Save_I<Vacant_Postulations_Ety>): Promise<Vacant_Postulations_Ety> {

        const new_VacantPostulation = await _em.create(Vacant_Postulations_Ety, save);
        await _em.persist(new_VacantPostulation);
        return new_VacantPostulation;

    }

    async find_all({ find, options, _em }: _Find_Many_I<Vacant_Postulations_Ety, 'Vacant_Postulations_Ety'>, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<Vacant_Postulations_Ety>> {

        if (!Pagination_Dto) {
            return {
                data: await this.find( find, options ),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(Vacant_Postulations_Ety, find);

        const data = await _em.find(Vacant_Postulations_Ety, find, {
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

    async delete_VacantPostulation({ find, _em }: _Process_Delete_I<Vacant_Postulations_Ety>): Promise<boolean> {

        const vacant_postulation_find = await this.findOne( find );

        if (!vacant_postulation_find) {
            throw new Error('vacant postulation not found');
        }

        await _em.nativeDelete(Vacant_Postulations_Ety, {
            _id: vacant_postulation_find._id
        });
        return true;

    }

    async update_VacantPostulation({ find, update, _em }: _Process_Update_I<Vacant_Postulations_Ety>): Promise<Vacant_Postulations_Ety> {

        const vacant_postulation_find = await this.findOne(find );

        if (!vacant_postulation_find) {
            throw new Error('vacant postulation not found');
        }

        Object.assign(vacant_postulation_find, update);
        await _em.persist(vacant_postulation_find);
        return vacant_postulation_find;

    }


}
