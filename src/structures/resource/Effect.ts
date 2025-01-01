import { Fight } from "../battle/Fight.js"
import { Info } from "../battle/actions/Info.js"
import { Entity } from "../entity/Entity.js"
import { Nullable } from "./Item.js"
import { Resource, ResourceData } from "./Resource.js"

export interface EffectTickPayload {
    entity: Entity
    fight: Fight
    effect: Effect
}

export interface EffectData extends ResourceData {
    description: string
    tick(payload: EffectTickPayload): Promise<void>
}

export class Effect extends Resource<EffectData> {
    public async tick(payload: EffectTickPayload) {
        return this.data.tick(payload)
    }
}