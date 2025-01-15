import { Resource, ResourceData } from "./Resource.js";
import { PlayerInventoryItem } from "../player/PlayerInventoryItem.js";
import { Action } from "../battle/actions/Action.js";
import { Entity } from "../entity/Entity.js";
import { GearType } from "./Item.js";
import { Hit } from "../battle/actions/Hit.js";
import { SpellAttack } from "../battle/actions/SpellAttack.js";
import { Enum } from "../static/Enum.js";
import { Fight } from "../battle/Fight.js";

export interface ItemPassiveBasePayload {
    passive: ItemPassive
    entity: Entity
}

export interface ItemPassiveExecutePayload extends ItemPassiveBasePayload {
    action: Action
    fight: Fight
}

export interface ItemPassiveData extends ResourceData {
    cooldown?: number
    types?: any[]
    gearTypes?: GearType[]
    chance?: number
    showTag?: boolean
    criteria(payload: ItemPassiveExecutePayload): boolean
    info(passive: ItemPassive): string
    execute(payload: ItemPassiveExecutePayload): boolean
}

export class ItemPassive extends Resource<ItemPassiveData> {
    public static readonly AttackActions = [ Hit, SpellAttack ]
    public static readonly Jewelry = [ GearType.Ring, GearType.Necklace ]
    public static readonly NonWeapons = Enum.values(GearType).filter(x => x !== GearType.Weapon)
    public static readonly OnlyWeapons = [ GearType.Weapon ]

    public info() {
        return this.data.info(this)
    }

    public canHave(type: GearType) {
        return this.data.gearTypes?.includes(type) ?? true
    }
    
    public get tag() {
        return `[${this.simpleName.toUpperCase()}]`
    }

    public get showTag() {
        return this.data.showTag !== false
    }
}