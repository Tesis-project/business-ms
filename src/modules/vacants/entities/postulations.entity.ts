
import { Cascade, Entity, EntityRepositoryType, Enum, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";
import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes";
import { Vacant_Postulation_Status_Enum } from "@tesis-project/dev-globals/dist/modules/business/vacants/interfaces";
import { Vacant_Ety } from "./vacant.entity";
import { Vacant_Postulations_Repository } from "./postulations.repository.service";

@Entity({
    tableName: 'postulations',
    collection: 'postulations',
    repository: () => Vacant_Postulations_Repository
})
export class Vacant_Postulations_Ety extends Schema_key {

    [EntityRepositoryType]?: Vacant_Postulations_Repository;

    @Property({
        type: 'text',
        nullable: true
    })
    comment?: string;

    @Enum({ items: () => Vacant_Postulation_Status_Enum, default: Vacant_Postulation_Status_Enum.SENDED })
    @Property()
    status: Vacant_Postulation_Status_Enum;

    @Property({
        type: 'text',
        nullable: true
    })
    owner_comment?: string;

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

    @ManyToOne(() => Vacant_Ety, { cascade: [Cascade.ALL] })
    vacant: Rel<Vacant_Ety>;

    @Property({
        type: 'varchar',
        unique: false,
        nullable: false
    })
    user_postulate: any;

}