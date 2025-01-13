import { RawPlayer } from "@prisma/client";
import NekoDatabase, { PlayerData } from "../../core/NekoDatabase.js";
import { Entity, IEntity } from "../entity/Entity.js";
import { EntityBaseStats } from "../entity/EntityBaseStats.js";
import { EntitySpell } from "../entity/EntitySpell.js";
import { Formulas } from "../static/Formulas.js";
import { PlayerBaseStats } from "./PlayerBaseStats.js";
import { PlayerGear } from "./PlayerGear.js";
import { PlayerInventory } from "./PlayerInventory.js";
import { PlayerSkills } from "./PlayerSkills.js";
import { PlayerSpells } from "./PlayerSpells.js";
import { RewardData, RewardOptions, Rewards } from "../static/Rewards.js";
import { Item } from "../resource/Item.js";
import { PlayerTasks } from "./PlayerTasks.js";
import { Game } from "../static/Game.js";
import { PlayerQuests } from "./PlayerQuests.js";
import { PlayerInventoryItem } from "./PlayerInventoryItem.js";

export class Player extends Entity<PlayerData, PlayerBaseStats> {
    public static DefaultXpReq = 100
    public static DefaultXpMultiplier = 1.8

    public readonly baseStats = new PlayerBaseStats(this)
    public readonly inventory = new PlayerInventory(this)
    public readonly spells = new PlayerSpells(this)
    public readonly skills = new PlayerSkills(this)
    public readonly quests = new PlayerQuests(this)
    public readonly tasks = new PlayerTasks(this)
    public readonly gear = new PlayerGear(this)

    public get zone() {
        return Game.Zones.get(this.data.zoneId!)
    }

    public hasMoney(m: number) {
        return this.data.money >= m
    }

    public hasGems(m: number) {
        return this.data.gems >= m
    }
    
    public getEquipment(): PlayerInventoryItem[] {
        return this.gear.toArray()
    }
    
    public getSpells(): EntitySpell[] {
        return this.spells.equipped.map(x => EntitySpell.from(x))
    }

    public addMoney(money: number) {
        this.data.money += money
    }

    public setMoney(money: number) {
        this.data.money = money
    }

    public addGems(gems: number) {
        this.data.gems += gems
    }

    public setGems(gems: number) {
        this.data.gems = gems
    }

    public addXp(xp: number): boolean {
        let oldLv = this.level, currentXp = this.data.xp

        while (xp !== 0) {
            const reqXp = this.getReqXp()
            const toAdd = xp + currentXp > reqXp ? reqXp - currentXp : xp
            
            currentXp += toAdd
            xp -= toAdd

            if (currentXp === reqXp) {
                currentXp = 0
                this.data.level++
            }
        }

        this.data.xp = currentXp
        
        return this.level !== oldLv
    }

    public getReqXp() {
        return Formulas.calculateReqXp(this.level, Player.DefaultXpReq, Player.DefaultXpMultiplier)
    }

    public get displayName(): string {
        return this.data.username
    }

    public clearCache() {
        this.spells["clearCache"]()
        this.gear["clearCache"]()
    }

    public save() {
        return NekoDatabase.saveFullPlayer(this.data)
    }

    public async give(options: Omit<RewardOptions, "player">) {
        return Rewards.give({
            ...options,
            player: this
        })
    }

    public async giveSimple(rewards: RewardData, times?: number) {
        return this.give({ rewards, times })
    }

    public async craft(item: Item, times?: number) {
        return item.craft(this, times)
    }

    public clone(): this {
        return this
    }
}