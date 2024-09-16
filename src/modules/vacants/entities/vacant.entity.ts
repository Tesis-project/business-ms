import { Collection, Entity, EntityRepositoryType, Enum, OneToMany, OneToOne, Property, Rel } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";
import { Media_I } from "@tesis-project/dev-globals/dist/modules/media/interfaces";

import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes"

import { Vacant_Budget_Costs_I, Vacant_Budget_Payment_I, Vacant_Housing_I, Vacant_I, Vacant_Transport_I, Vacants_Enum } from "@tesis-project/dev-globals/dist/modules/business/vacants/interfaces";
import { Artist_Enum } from "@tesis-project/dev-globals/dist/modules/profile/interfaces";
import { Vacant_Repository } from "./vacant.repository.service";
import { Vacant_Postulations_Ety } from "./postulations.entity";
import { Contract_Ety } from "../../contracts/entities/contract.entity";

@Entity({
    tableName: 'vacants',
    collection: 'vacants',
    repository: () => Vacant_Repository
})
export class Vacant_Ety extends Schema_key {

    [EntityRepositoryType]?: Vacant_Repository;

    @Property({
        type: 'jsonb',
        nullable: true,
    })
    vacant_pic?: Media_I;

    @Property({
        type: 'varchar'
    })
    title: string;

    @Property({
        type: 'text'
    })
    desc: string;

    @Enum({ items: () => Vacants_Enum, default: Vacants_Enum.OPEN })
    @Property()
    status: Vacants_Enum;

    @Property({
        type: 'timestamp',
        onCreate: () => new TempoHandler().date_now()
    })
    created_at? = new TempoHandler().date_now();

    @Property({
        type: 'timestamp',
        onUpdate: () => new TempoHandler().date_now()
    })
    updated_at? = new TempoHandler().date_now()

    @Property({
        type: 'jsonb',
        nullable: false,
        default: JSON.stringify({
            "start_at": '',
            "end_at": ''
        })
    })
    operation: Vacant_I['operation'];

    @Property({
        type: 'text'
    })
    role_desc: string;

    @Property({
        type: 'jsonb',
        nullable: false,
        default: JSON.stringify([
            'SINGER',
        ])
    })
    role_type: Artist_Enum[];

    @Property({
        type: 'jsonb',
        nullable: true,
    })
    transport_service?: Vacant_Transport_I;

    @Property({
        type: 'jsonb',
        nullable: true,
    })
    housing_service?: Vacant_Housing_I;

    @Property({
        type: 'jsonb',
        nullable: true,
    })
    vacant_costs?: Vacant_Budget_Costs_I;

    @Property({
        type: 'jsonb',
        nullable: false,
        default: JSON.stringify({
            "total": 0,
            "currency": "USD"
        })
    })
    vacant_payment: Vacant_Budget_Payment_I;

    @Property({
        type: 'jsonb',
        nullable: true
    })
    direction?: Vacant_I['direction'];

    @Property({
        type: 'text',
        nullable: true
    })
    specific_conditions?: string;

    @Property({
        type: 'varchar',
        unique: false
    })
    owner?: any;

    @OneToMany(() => Vacant_Postulations_Ety, e => e.vacant, { mappedBy: 'vacant', orphanRemoval: true })
    postulations?: Vacant_Postulations_Ety[];

    @OneToOne(() => Contract_Ety, c => c.vacant, { mappedBy: 'vacant', orphanRemoval: true })
    contract: Rel<Contract_Ety>;

}


