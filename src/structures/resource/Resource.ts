import { Hit } from "../battle/actions/Hit.js"
import { Util } from "../static/Util.js"
import { Nullable } from "./Item.js"
import { ItemPassiveExecutePayload } from "./ItemPassive.js"

export interface ResourceData {
    description?: Nullable<string>
    emoji?: Nullable<string>
    id: number
    name: string
}

export class Resource<Data extends ResourceData = ResourceData> {
    public constructor(public readonly data: Data) {}

    public get id() {
        return this.data.id
    }

    public get name() {
        return this.data.name
    }

    public get emoji() {
        return this.data.emoji ?? null
    }
    
    public get simpleName() {
        return `${this.emoji && `${this.emoji} ` || ''}${this.name}`
    }

    public get image() {
        return Util.getEmojiUrl(this.emoji)
    }

    /**
     * 
     * @param payload 
     * @returns True if this entity is defending
     */
    public static defending(payload: ItemPassiveExecutePayload) {
        return payload.entity === payload.action.as<Hit>().defender
    }

    /**
     * 
     * @param payload 
     * @returns True if this entity is attacking
     */
    public static attacking(payload: ItemPassiveExecutePayload) {
        return payload.entity === payload.action.as<Hit>().entity
    }

    public static attackerUnderHp(payload: ItemPassiveExecutePayload, under: number) {
        return payload.entity.moddedStats.entity.hp / payload.entity.moddedStats.maxHealth <= under
    }

    public static attackerOverHp(payload: ItemPassiveExecutePayload, over: number) {
        return payload.entity.moddedStats.entity.hp / payload.entity.moddedStats.maxHealth >= over
    }

    public static defenderUnderHp(payload: ItemPassiveExecutePayload, under: number) {
        return (payload.action as Hit).defender.moddedStats.entity.hp / (payload.action as Hit).defender.moddedStats.maxHealth <= under
    }

    public static defenderOverHp(payload: ItemPassiveExecutePayload, over: number) {
        return (payload.action as Hit).defender.moddedStats.entity.hp / (payload.action as Hit).defender.moddedStats.maxHealth >= over
    }
}