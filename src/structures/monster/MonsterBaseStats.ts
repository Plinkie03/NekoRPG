import { EntityBaseStats, Stats } from "../entity/EntityBaseStats.js";
import { Monster } from "./Monster.js";

export class MonsterBaseStats extends EntityBaseStats {
    public constructor(private readonly monster: Monster) {
        super(monster)
    }

    public get maxHealth(): number {
        return this.getStat("maxHealth")
    }

    public get strength(): number {
        return this.getStat("strength")
    }

    public get defense(): number {
        return this.getStat("defense")
    }

    public get agility(): number {
        return this.getStat("agility")
    }

    public get blockReduction(): number {
        return this.getStat("blockReduction")
    }

    public get blockRate(): number {
        return this.getStat("blockRate")
    }

    public get criticalRate(): number {
        return this.getStat("criticalRate")
    }

    public get criticalMultiplier(): number {
        return this.getStat("criticalMultiplier")
    }

    public get dodgeRate(): number {
        return this.getStat("dodgeRate")
    }

    public get lifesteal(): number {
        return this.getStat("lifesteal")
    }

    public getStat(name: keyof Stats): number {
        return this.monster.data.stats[name]!
    }
}