import { EntityBaseStats } from "../entity/EntityBaseStats.js";
import { Player } from "./Player.js";
import { SkillType } from "./PlayerSkills.js";

export class PlayerBaseStats extends EntityBaseStats {
    public constructor(private readonly player: Player) {
        super(player)
    }

    public get lifesteal(): number {
        return 0 + this.player.gear.stats.lifesteal
    }

    public get dodgeRate(): number {
        return 0 + this.player.gear.stats.dodgeRate
    }

    public get maxHealth(): number {
        return (100 + this.player.gear.stats.maxHealth) * this.player.skills.get(SkillType.Endurance).multiplier
    }

    public get strength(): number {
        return (20 + this.player.gear.stats.strength) * this.player.skills.get(SkillType.Melee).multiplier
    }

    public get defense(): number {
        return (5 + this.player.gear.stats.defense) * this.player.skills.get(SkillType.Defense).multiplier
    }

    public get agility(): number {
        return 0 + this.player.gear.stats.agility
    }

    public get blockReduction(): number {
        return 25 + this.player.gear.stats.blockReduction
    }

    public get blockRate(): number {
        return 10 + this.player.gear.stats.blockRate
    }

    public get criticalRate(): number {
        return 10 + this.player.gear.stats.criticalRate
    }

    public get criticalMultiplier(): number {
        return 150 + this.player.gear.stats.criticalMultiplier
    }
}