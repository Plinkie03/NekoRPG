import { TypedEmitter } from "tiny-typed-emitter"
import { EntityBaseStats } from "./EntityBaseStats.js"
import { EntityModdedStats } from "./EntityModdedStats.js"
import { EntitySpell } from "./EntitySpell.js"

export interface IEntity<Id> {
    id: Id
    level: number
}

export interface EntityEvents {
    dead(entity: Entity): any
}

export abstract class Entity<Data extends IEntity<any> = IEntity<any>, Stats extends EntityBaseStats = EntityBaseStats> extends TypedEmitter<EntityEvents> {
    /**
     * These stats are the base used for a fight, they do not change by effects
     */
    public readonly abstract baseStats: Stats

    /**
     * Modded stats are modified during fights by effects
     */
    public readonly moddedStats = new EntityModdedStats(this)

    /**
     * HP for fights, set to 0 by default
     */
    public hp: number = 0

    public constructor(public readonly data: Data) {
        super()
    }
    
    public get id() {
        return this.data.id
    }

    public get level() {
        return this.data.level
    }

    public get displayLevel() {
        return ` [${this.level}]`
    }

    public isDead() {
        return this.hp === 0
    }

    public heal(by: number) {
        if (this.isDead()) return
        this.hp += by
        
        if (this.hp < 0)
            this.hp = 0
        else if (this.hp >= this.moddedStats.maxHealth)
            this.hp = this.moddedStats.maxHealth

        if (this.hp === 0) {
            this.emit("dead", this)
        }
    }

    public damage(by: number) {
        this.heal(-by)
    }

    public reset() {
        this.hp = this.baseStats.maxHealth
        this.moddedStats.reset()
    }

    public abstract getSpells(): EntitySpell[]
    public abstract get displayName(): string
    public abstract clone(): Entity
}