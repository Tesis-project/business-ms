import { Entity, Property } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";
import { Media_I } from "@tesis-project/dev-globals/dist/modules/media/interfaces";

import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes"

@Entity({
    tableName: 'vacants',
    collection: 'vacants',
    // repository: () => Media_Repository
})
export class Vacant_Ety extends Schema_key {

    // [EntityRepositoryType]?: Media_Repository;

    @Property({
        type: 'jsonb',
        nullable: true,
    })
    profile_pic?: Media_I;

        @Property({
        type: 'timestamp',
        onCreate: () => new TempoHandler().date_now()
    })
    created_at = new TempoHandler().date_now()


}