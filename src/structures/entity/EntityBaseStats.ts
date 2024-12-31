import { Util } from "../static/Util.js";
import { Entity } from "./Entity.js";

export type Stats = Omit<{
    -readonly [P in keyof EntityBaseStats as EntityBaseStats[P] extends number ? P : never]: EntityBaseStats[P]
}, "maxDamage" | "minDamage">

export abstract class EntityBaseStats {
    public constructor(public readonly entity: Entity) {}

    // TODO: ADD CC STAT
    public abstract get maxHealth(): number
    public abstract get strength(): number
    public abstract get defense(): number
    public abstract get agility(): number
    public abstract get blockReduction(): number
    public abstract get blockRate(): number
    public abstract get criticalRate(): number
    public abstract get criticalMultiplier(): number
    public abstract get dodgeRate(): number
    public abstract get lifesteal(): number
    
    public get healRate() {
        return 100
    }

    public get(): Stats {
        return Util.getStatsFrom(this)
    }

    public getStat(name: keyof Stats) {
        return this[name]
    }

    public static createEmptyStats(): Stats {
        return {
            healRate: 0,
            lifesteal: 0,
            dodgeRate: 0,
            agility: 0,
            blockRate: 0,
            blockReduction: 0,
            criticalMultiplier: 0,
            criticalRate: 0,
            defense: 0,
            maxHealth: 0,
            strength: 0
        }
    }

    public get maxDamage() {
        return Math.floor(this.entity.moddedStats.strength * 1.25)
    }

    public get minDamage() {
        return Math.floor(this.entity.moddedStats.strength * 0.75)
    }

    public displayDamage(mult = 1) {
        return `${Math.floor(this.minDamage * mult)}-${Math.floor(this.maxDamage * mult)}`
    }
}