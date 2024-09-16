
import { Cascade, Entity, EntityRepositoryType, Enum, OneToOne, Property, Rel } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";

import { Contract_Details_I, Contract_Sign_I, Contract_Status_Enum } from "@tesis-project/dev-globals/dist/modules/business/contracts/interfaces";
import { Vacant_Ety } from "../../vacants/entities/vacant.entity";
import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes";
import { Contract_Repository } from "./contracts.repository.service";

@Entity({
    tableName: 'contracts',
    collection: 'contracts',
    repository: () => Contract_Repository
})
export class Contract_Ety extends Schema_key {

        [EntityRepositoryType]?: Contract_Repository;

    @Property({
        type: 'jsonb',
        nullable: false,
    })
    contratist?: Contract_Sign_I;

    @Property({
        type: 'jsonb',
        nullable: false,
    })
    contractor?: Contract_Sign_I;

    @Property({
        type: 'jsonb',
        nullable: true,
    })
    details?: Contract_Details_I;

    @Enum({ items: () => Contract_Status_Enum, default: Contract_Status_Enum.PLANNING })
    @Property()
    status: Contract_Status_Enum;

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


    @OneToOne(() => Vacant_Ety, { cascade: [Cascade.ALL] })
    vacant: Rel<Vacant_Ety>;


}