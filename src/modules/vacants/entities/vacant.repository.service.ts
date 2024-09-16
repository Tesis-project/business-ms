import { EntityRepository, EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Vacant_Ety } from "./vacant.entity";
import { Pagination_I, pagination_meta } from "@tesis-project/dev-globals/dist/core/helpers";
import { _Process_Save_I, _Find_Many_I, _Process_Delete_I, _Process_Update_I } from "@tesis-project/dev-globals/dist/core/interfaces";

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';

@Injectable()
export class Vacant_Repository extends EntityRepository<Vacant_Ety> {

    constructor(
        em: EntityManager,
    ) {
        super(em.fork(), Vacant_Ety);
    }

    async create_Vacant({ save, _em }: _Process_Save_I<Vacant_Ety>): Promise<Vacant_Ety> {

        const new_Vacant = await _em.create(Vacant_Ety, save);
        await _em.persist(new_Vacant);
        return new_Vacant;

    }

    async find_all({ find, options, _em }: _Find_Many_I<Vacant_Ety, 'Vacant_Ety'>, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<Vacant_Ety>> {

        if (!Pagination_Dto) {
            return {
                data: await this.find( find, options ),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(Vacant_Ety, find);

        const data = await _em.find(Vacant_Ety, find, {
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

    async delete_Vacant({ find, _em }: _Process_Delete_I<Vacant_Ety>): Promise<boolean> {

        const vacant_find = await this.findOne( find );

        if (!vacant_find) {
            throw new Error('vacant not found');
        }

        await _em.nativeDelete(Vacant_Ety, {
            _id: vacant_find._id
        });
        return true;

    }

    async update_Vacant({ find, update, _em }: _Process_Update_I<Vacant_Ety>): Promise<Vacant_Ety> {

        const vacant_find = await this.findOne(find );

        if (!vacant_find) {
            throw new Error('vacant not found');
        }

        Object.assign(vacant_find, update);
        await _em.persist(vacant_find);
        return vacant_find;

    }


}
