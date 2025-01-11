import { Resource, ResourceData } from "./Resource.js";
import { PlayerInventoryItem } from "../player/PlayerInventoryItem.js";
import { Action } from "../battle/actions/Action.js";
import { Entity } from "../entity/Entity.js";
import { GearType } from "./Item.js";

export interface ItemPassiveBasePayload {
    passive: ItemPassive
    entity: Entity
}

export interface ItemPassiveExecutePayload extends ItemPassiveBasePayload {
    action: Action
}

export interface ItemPassiveData extends ResourceData {
    cooldown?: number
    types: any[]
    gearTypes?: GearType[]
    chance?: number
    criteria(payload: ItemPassiveExecutePayload): boolean
    info(passive: ItemPassive): string
    execute(payload: ItemPassiveExecutePayload): boolean
}

export class ItemPassive extends Resource<ItemPassiveData> {
    public info() {
        return this.data.info(this)
    }

    public canHave(type: GearType) {
        return this.data.gearTypes?.includes(type) ?? true
    }
}