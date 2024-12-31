import { Prisma, RawItem } from "@prisma/client";
import { Game } from "../static/Game.js";
import { Player } from "./Player.js";
import { PlayerInventoryItem } from "./PlayerInventoryItem.js";
import NekoDatabase, { PlayerItemData } from "../../core/NekoDatabase.js";
import { Item, Nullable } from "../resource/Item.js";
import { Rarity } from "../static/Rarity.js";
import { Formulas } from "../static/Formulas.js";
import { Util } from "../static/Util.js";

export class PlayerInventory {
    public constructor(private readonly player: Player) {}

    public get items() {
        return this.rawItems.map(this.from.bind(this))
    }
    
    public get rawItems() {
        return this.player.data.items
    }

    private from(raw: PlayerItemData) {
        return new PlayerInventoryItem(this, raw)
    }

    public getItemByUUID(uuid: string): Nullable<PlayerInventoryItem> {
        return this.items.find(x => x.uuid === uuid) ?? null
    }

    public getItemById(id: number): Nullable<PlayerInventoryItem> {
        return this.items.find(x => x.data.itemId === id) ?? null
    }

    public getItemsById(id: number): PlayerInventoryItem[] {
        return this.items.filter(x => x.data.itemId === id)
    }

    private async deleteItems(items: PlayerInventoryItem[]) {
        for (const item of items) {
            await item.destroy()
        }
    }

    private async deleteItem(itm: PlayerInventoryItem) {
        const index = itm.index
        if (index === null) return false

        await NekoDatabase.deleteItem(itm.uuid)
        this.rawItems.splice(index, 1)

        return true
    }

    private async setItemOwner(itm: PlayerInventoryItem, ownerId: string) {
        await NekoDatabase.updateItem({
            playerId: ownerId,
            uuid: itm.data.uuid
        })

        itm.data.playerId = ownerId
    }

    private async setItemAmount(itm: PlayerInventoryItem, am: number) {
        await NekoDatabase.updateItem({
            uuid: itm.uuid,
            amount: am
        })

        itm.data.amount = am
    }

    public async addItem(param: Parameters<PlayerInventory["createRawItem"]>[0], stack = true): Promise<PlayerInventoryItem> {
        const item = Game.getItem(param.itemId)

        if (item.isStackable() && stack) {
            const current = this.getItemById(param.itemId)
            if (!current) return this.addItem(param, false)
            await this.setItemAmount(current, current.amount + (param.amount ?? 1))
            return current
        } else {
            const raw = await NekoDatabase.createItem(this.createRawItem(param))
            this.rawItems.push(raw)
            return this.from(raw)
        }
    }

    private createRawItem(data: Omit<Prisma.RawItemUncheckedCreateInput, "stats" | "amount" | "rarity" | "locked" | "playerId" | "multiplier" | "uuid"> & { amount?: number, rarity?: number }, rarityMultiplier: number = 1) {
        const rarity = data.rarity ? Rarity.get(data.rarity) : Rarity.getRandom(rarityMultiplier)
        const item = Game.getItem(data.itemId)

        return {
            rarity: rarity.type,
            equipped: data.equipped,
            stats: item.isGear() ? {
                create: Item.getRandomStats(rarity.type)
            } : undefined,
            multiplier: item.isEquippable() ? Formulas.random(rarity.multiplier[0], rarity.multiplier[1]) : 1,
            amount: data.amount ?? 1,
            itemId: data.itemId,
            playerId: this.player.id
        }
    }

    public rawAt(index: number): Nullable<PlayerItemData> {
        return this.rawItems[index] ?? null
    }

    public at(index: number) {
        const itm = this.rawAt(index)
        return itm ? this.from(itm) : itm
    }

    public count(item: Item) {
        return this.rawItems.reduce((x, y) => x + (y.itemId === item.id ? y.amount : 0), 0)
    }

    public page(n: number) {
        const offset = n * 10 - 10
        return this.rawItems.slice(offset, offset + 10).map(this.from.bind(this))
    }

    public search(q: string) {
        return Util.searchMany(
            this.items,
            q,
            el => el.index!,
            el => el.item.name
        )
    }

    [Symbol.iterator]() {
        return this.items.values()
    }
}