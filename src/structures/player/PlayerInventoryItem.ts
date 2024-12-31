import { RawItem } from "@prisma/client";
import { PlayerInventory } from "./PlayerInventory.js";
import { Game } from "../static/Game.js";
import { Stats } from "../entity/EntityBaseStats.js";
import { Rarity, RarityType } from "../static/Rarity.js";
import NekoDatabase, { PlayerItemData } from "../../core/NekoDatabase.js";
import { PlayerSpells } from "./PlayerSpells.js";
import { Item, ItemType, Nullable } from "../resource/Item.js";
import { Util } from "../static/Util.js";

export enum PlayerInventoryItemAmountChangeResponse {
    Destroyed,
    Changed
}

export enum InventoryEquipGearResponseType {
    Success,
    CantEquip,
    MissingRequirements,
    AlreadyEquipped
}

export type InventoryEquipGearResponse = {
    type: InventoryEquipGearResponseType.AlreadyEquipped | InventoryEquipGearResponseType.CantEquip
} | {
    type: InventoryEquipGearResponseType.MissingRequirements,
    errors: string[]
} | {
    type: InventoryEquipGearResponseType.Success,
    old: Nullable<PlayerInventoryItem>
}

export enum InventoryEquipSpellResponseType {
    Success,
    CantEquip,
    MissingRequirements,
    Full,
    AlreadyEquipped
}

export type InventoryEquipSpellResponse = {
    type: InventoryEquipSpellResponseType.Success | InventoryEquipSpellResponseType.CantEquip | InventoryEquipSpellResponseType.AlreadyEquipped | InventoryEquipSpellResponseType.Full
} | {
    type: InventoryEquipSpellResponseType.MissingRequirements,
    errors: string[]
}


export class PlayerInventoryItem<T extends ItemType = ItemType> {
    public constructor(
        private readonly manager: PlayerInventory,
        public readonly data: PlayerItemData
    ) {}

    public get index() {
        const index = this.manager.rawItems.findIndex(x => x.uuid === this.uuid)
        return index === -1 ? null : index
    }

    public get item() {
        return Game.getItem<T>(this.data.itemId)
    }

    public get uuid() {
        return this.data.uuid
    }

    public get equipped() {
        return this.data.equipped
    }

    public get locked() {
        return this.data.locked
    }

    public get detailedAmount() {
        return this.amount === 1 ? "" : ` ${this.amount}x`
    }

    public get destroyable() {
        return !(this.equipped || this.locked)
    }
    
    public detailedName(emoji = true) {
        const output = new Array<string>(emoji ? this.item.simpleName : this.item.name)

        if (this.item.isEquippable()) {
            output.push(`[${RarityType[this.rarity.type]} (${this.multiplier.toFixed(2)}x)]`)
        }

        return output.join(" ")
    }

    public get amount() {
        return this.data.amount
    }

    public get multiplier() {
        return this.data.multiplier
    }

    public get rarity() {
        return Rarity.get(this.data.rarity)
    }

    public as<T extends ItemType>(): PlayerInventoryItem<T> {
        return this as unknown as PlayerInventoryItem<T>
    }

    public setAmount(n: number) {
        n = Math.max(Math.min(n, this.amount), 0)
        return n === 0 ? this.destroy().then(() => PlayerInventoryItemAmountChangeResponse.Destroyed) : this.manager["setItemAmount"](this, n).then(() => PlayerInventoryItemAmountChangeResponse.Changed)
    }

    public setOwner(id: string) {
        return this.manager["setItemOwner"](this, id)
    }

    public destroy() {
        return !this.destroyable ? Promise.resolve(false) : this.manager["deleteItem"](this)
    }

    public getStat(stat: keyof Stats) {
        const value = (this.item.isGear() ? this.item.getStat(stat) : 0) * this.multiplier
        const statBoost = this.getStatBoost(stat)

        return Item.isPercentualStat(stat) ? value + statBoost : value * (statBoost || 1)
    }

    public getStats(): Stats {
        return Util.getStatsFrom(this)
    }

    private getStatBoost(stat: keyof Stats) {
        return this.data.stats.filter(x => x.type === stat).reduce((x, y) => x + y.value, 0)
    }

    public get maxHealth() {
        return this.getStat("maxHealth")
    }

    public get dodgeRate() {
        return this.getStat("dodgeRate")
    }

    public get lifesteal() {
        return this.getStat("lifesteal")
    }

    public get defense() {
        return this.getStat("defense")
    }

    public get strength() {
        return this.getStat("strength")
    }

    public get agility() {
        return this.getStat("agility")
    }

    public get blockRate() {
        return this.getStat("blockRate")
    }

    public get healRate() {
        return this.getStat("healRate")
    }

    public get blockReduction() {
        return this.getStat("blockReduction")
    }

    public get criticalMultiplier() {
        return this.getStat("criticalMultiplier")
    }

    public get criticalRate() {
        return this.getStat("criticalRate")
    }

    public async equipSpell(): Promise<InventoryEquipSpellResponse> {
        if (!this.item.isSpell()) return { type: InventoryEquipSpellResponseType.CantEquip }
        else if (this.entity.spells.equipped.length >= PlayerSpells.MaximumEquippedSpells) return { type: InventoryEquipSpellResponseType.Full }
        else if (this.equipped) return { type: InventoryEquipSpellResponseType.AlreadyEquipped }

        const errors = this.hasRequirements()
        if (errors !== true) return { type: InventoryEquipSpellResponseType.MissingRequirements, errors }

        this.setEquipped(true)

        this.manager["player"].clearCache()

        return { type: InventoryEquipSpellResponseType.Success }
    }

    public async equipGear(): Promise<InventoryEquipGearResponse> {
        if (!this.item.isGear()) return { type: InventoryEquipGearResponseType.CantEquip }
        else if (this.equipped) return { type: InventoryEquipGearResponseType.AlreadyEquipped }

        const errors = this.hasRequirements()
        if (errors !== true) return { type: InventoryEquipGearResponseType.MissingRequirements, errors }
        
        const current = this.manager["player"].gear.equipped[this.item.gearType!]

        if (current) {
            await current.setEquipped(false)
        }

        await this.setEquipped(true)

        this.manager["player"].clearCache()

        return {
            old: current ?? null,
            type: InventoryEquipGearResponseType.Success
        }
    }

    public equip() {
        return this.item.isSpell() ? this.equipSpell() : this.equipGear()
    }

    public async unequip(): Promise<boolean> {
        if (!this.equipped) return false
        await this.setEquipped(false)
        this.manager["player"].clearCache()
        return true
    }

    private async setEquipped(state: boolean) {
        await NekoDatabase.updateItem({
            uuid: this.uuid,
            equipped: state
        })

        this.data.equipped = state
    }

    public async setLocked(state: boolean = !this.data.locked) {
        await NekoDatabase.updateItem({
            uuid: this.uuid,
            locked: state            
        })

        this.data.locked = state
    }

    public get entity() {
        return this.manager["player"]
    }

    public hasRequirements() {
        return this.item.hasRequirements(this.entity)
    }

    public hasCraftRequirements() {
        return this.item.hasCraftRequirements(this.entity)
    }
}