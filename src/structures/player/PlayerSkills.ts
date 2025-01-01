import { RawPlayerSkills } from "@prisma/client";
import { Player } from "./Player.js";
import { Formulas } from "../static/Formulas.js";
import NekoDatabase from "../../core/NekoDatabase.js";
import { GearType, WeaponType } from "../resource/Item.js";

export type Skills = {
    [P in keyof RawPlayerSkills as P extends `${infer T}Level` ? T : never]: number
}

export class PlayerSkills {
    public static readonly DefaultXpReq = 10
    public static readonly DefaultXpMultiplier = 1.2

    public constructor(private readonly player: Player) { }

    public getLevel(name: keyof Skills) {
        return this.player.data.skills![PlayerSkills.formatSkillLevel(name)]
    }

    public setLevel(name: keyof Skills, lv: number) {
        this.player.data.skills![PlayerSkills.formatSkillLevel(name)] = lv
    }

    public getMultiplier(name: keyof Skills) {
        return Formulas.calculateSkillMultiplier(this.getLevel(name))
    }

    public getXp(name: keyof Skills) {
        return this.player.data.skills![PlayerSkills.formatSkillXp(name)]
    }

    public setXp(name: keyof Skills, xp: number) {
        this.player.data.skills![PlayerSkills.formatSkillXp(name)] = xp
    }

    public getReqXp(name: keyof Skills) {
        return Formulas.calculateReqXp(this.getLevel(name), PlayerSkills.DefaultXpReq, PlayerSkills.DefaultXpMultiplier)
    }

    public getCombatSkillName(): keyof Skills {
        const weapon = this.player.gear.equipped[GearType.Weapon]

        if (weapon) {
            return weapon.item.weaponType === WeaponType.Axe ? "melee" :
                weapon.item.weaponType === WeaponType.Sword ? "melee" :
                    "distance"
        }

        return "melee"
    }

    public addXp(skill: keyof Skills, xp: number): boolean {
        let oldLv = this.getLevel(skill), currentXp = this.getXp(skill)

        while (xp !== 0) {
            const reqXp = this.getReqXp(skill)
            const toAdd = xp + currentXp > reqXp ? reqXp - currentXp : xp

            currentXp += toAdd
            xp -= toAdd

            if (currentXp === reqXp) {
                currentXp = 0
                this.setLevel(skill, this.getLevel(skill) + 1)
            }
        }

        this.setXp(skill, currentXp)

        return this.getLevel(skill) !== oldLv
    }

    public static formatSkillXp(skill: keyof Skills) {
        return `${skill}Xp` as const
    }

    public static formatSkillLevel(skill: keyof Skills) {
        return `${skill}Level` as const
    }
}