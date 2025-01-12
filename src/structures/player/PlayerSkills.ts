import { RawPlayerSkill } from "@prisma/client";
import { Player } from "./Player.js";
import { Formulas } from "../static/Formulas.js";
import NekoDatabase from "../../core/NekoDatabase.js";
import { GearType, WeaponType } from "../resource/Item.js";
import { Enum } from "../static/Enum.js";

export enum SkillType {
    Smithing,
    Mining,
    Woodcutting,
    Melee,
    Endurance,
    Defense
}

export interface PlayerSkillData {
    type: SkillType
    xp: number
    level: number
    reqXp: number
    multiplier: number
}

export type Skills = {
    [P in SkillType]: number
}

export class PlayerSkills {
    public static readonly DefaultXpReq = 10
    public static readonly DefaultXpMultiplier = 1.75

    public constructor(private readonly player: Player) { }

    public get raw() {
        return this.player.data.skills
    }

    public getCombatSkillName() {
        const weapon = this.player.gear.equipped[GearType.Weapon]

        if (weapon) {
            return SkillType.Melee
        }

        return SkillType.Melee
    }

    public async addXp(type: SkillType, xp: number) {
        const raw = this.getRaw(type)

        const oldLv = raw.level

        while (xp !== 0) {
            const reqXp = this.getReqXp(raw.level)
            const toAdd = xp + raw.xp > reqXp ? reqXp - raw.xp : xp

            raw.xp += toAdd
            xp -= toAdd

            if (raw.xp === reqXp) {
                raw.xp = 0
                raw.level++
            }
        }

        await NekoDatabase.rawPlayerSkill.update({
            data: raw,
            where: {
                playerId_type: {
                    playerId: this.player.id,
                    type
                }
            }
        })

        return oldLv !== raw.level
    }

    private getMultiplier(lv: number) {
        return Formulas.calculateSkillMultiplier(lv)
    }

    private getRaw(type: SkillType): RawPlayerSkill {
        const raw = this.raw.find(x => x.type === type)
        return raw!
    }

    public get(type: SkillType): PlayerSkillData {
        const raw = this.getRaw(type)

        return {
            ...raw,
            multiplier: this.getMultiplier(raw.level),
            type,
            reqXp: this.getReqXp(raw.level)
        }
    }

    private getReqXp(lv: number) {
        return Formulas.calculateReqXp(lv, PlayerSkills.DefaultXpReq, PlayerSkills.DefaultXpMultiplier)
    }

    public toArray() {
        return Enum.values(SkillType).map(this.get.bind(this))
    }

    public async ensure() {
        for (const skill of Enum.values(SkillType)) {
            const exists = !!this.getRaw(skill)
            if (!exists) {
                const data = await NekoDatabase.rawPlayerSkill.create({
                    data: {
                        type: skill,
                        playerId: this.player.id
                    }
                })

                this.raw.push(data)
            }
        }
    }
}