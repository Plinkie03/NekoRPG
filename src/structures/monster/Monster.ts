import { Entity, IEntity } from "../entity/Entity.js";
import { EntityBaseStats, Stats } from "../entity/EntityBaseStats.js";
import { EntitySpell } from "../entity/EntitySpell.js";
import { Player } from "../player/Player.js";
import { PlayerInventoryItem } from "../player/PlayerInventoryItem.js";
import { SpellItem } from "../resource/Item.js";
import { ResourceData } from "../resource/Resource.js";
import { RewardData, RewardOptions, Rewards } from "../static/Rewards.js";
import { MonsterBaseStats } from "./MonsterBaseStats.js";

export interface MonsterData extends IEntity<number>, ResourceData {
    spells?: SpellItem[]
    stats: Partial<Stats> & {
        maxHealth: number
        strength: number
    }
    rewards: RewardData
}

export class Monster extends Entity<MonsterData> {
    public readonly baseStats: MonsterBaseStats = new MonsterBaseStats(this)
    public isSummon = false

    public getSpells(): EntitySpell[] {
        return this.data.spells?.map(x => new EntitySpell(this, x.id, 1)) ?? []
    }

    public getEquipment(): PlayerInventoryItem[] {
        return []
    }

    public get displayName(): string {
        return this.data.name
    }

    public clone() {
        return new Monster(this.data)
    }

    public loot(options: Omit<RewardOptions, "rewards">) {
        if (this.isSummon) return new Array<string>()

        return Rewards.give({
            rewards: this.data.rewards,
            ...options
        })
    }
}