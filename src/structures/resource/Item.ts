import { Prisma } from "@prisma/client"
import { Hit } from "../battle/actions/Hit.js"
import { Fight } from "../battle/Fight.js"
import { Entity } from "../entity/Entity.js"
import { Stats } from "../entity/EntityBaseStats.js"
import { EntitySpell } from "../entity/EntitySpell.js"
import { Player } from "../player/Player.js"
import { PlayerInventoryItem } from "../player/PlayerInventoryItem.js"
import { Skills } from "../player/PlayerSkills.js"
import { Formulas } from "../static/Formulas.js"
import { RarityType } from "../static/Rarity.js"
import { Requirements } from "../static/Requirements.js"
import { RewardData, RewardItemData, Rewards } from "../static/Rewards.js"
import { Util } from "../static/Util.js"
import { Resource, ResourceData } from "./Resource.js"

export type Nullable<T> = T | null

export interface ItemData<T extends ItemType = ItemType> extends ResourceData {
    type: T
    craft?: CraftData
    price?: number
    requirements?: RequirementData
}

export interface RequirementData {
    items?: RequirementItemData[]
    level?: number
    stats?: Partial<Stats>
    skills?: Partial<Skills>
}

export interface RequirementItemData {
    item: Item
    amount: number
}

export interface CraftData {
    requirements: RequirementData
    chance?: number
    rewards: RewardData
    amount?: number
}

export enum CraftItemResponseType {
    Success,
    Failure,
    MissingRequirements,
    NotCraftable
}

export type CraftItemResponse = {
    type: CraftItemResponseType.Success,
    failed: number,
    success: number,
    rewards: string[]
} | {
    type: CraftItemResponseType.MissingRequirements,
    errors: string[]
} | {
    type: CraftItemResponseType.NotCraftable | CraftItemResponseType.Failure
}

export enum ItemType {
    Gear,
    Spell,
    Material,
    Lootbox
}

export enum GearType {
    Shield,
    Weapon,
    Helmet,
    Chestplate,
    Leggings,
    Boots,
    Ring,
    Necklace
}

export interface GearItemData extends ItemData<ItemType.Gear> {
    stats: Partial<Stats>
    gearType: GearType
    weaponType?: WeaponType
}

export interface MaterialItemData extends ItemData<ItemType.Material> {}

export enum WeaponType {
    Sword,
    Bow,
    Axe
}
export interface SpellExecutionPayload {
    fight: Fight
    hit: Hit
    spell: EntitySpell
    entity: Entity
    target: Entity
}

export interface SpellItemData extends ItemData<ItemType.Spell> {
    cooldown?: number
    chance?: number
    multitarget?: boolean
    info(spell: EntitySpell): string
    execute(payload: SpellExecutionPayload): void
}

export interface LootboxItemData extends ItemData<ItemType.Lootbox> {
    rewards: RewardData
}

export enum LootboxOpenResponseType {
    NotLootbox,
    MissingRequirements,
    Failed,
    Success
}

export type LootboxOpenResponse = {
    type: LootboxOpenResponseType.Failed | LootboxOpenResponseType.NotLootbox
} | {
    type: LootboxOpenResponseType.Success,
    rewards: string[]
} | {
    type: LootboxOpenResponseType.MissingRequirements,
    errors: string[]
}

export interface ItemInterfaces {
    [ItemType.Lootbox]: LootboxItemData
    [ItemType.Gear]: GearItemData
    [ItemType.Material]: MaterialItemData
    [ItemType.Spell]: SpellItemData
}

export class Item<T extends ItemType = ItemType> extends Resource<ItemInterfaces[T]> {
    public static readonly RandomStatMinMax: Record<keyof Stats, [number, number]> = {
        agility: [1, 10],
        defense: [1, 10],
        maxHealth: [1, 10],
        healRate: [1, 5],
        strength: [1, 10],
        lifesteal: [1, 5],
        blockRate: [1, 5],
        blockReduction: [1, 3],
        criticalMultiplier: [1, 10],
        criticalRate: [1, 5],
        dodgeRate: [1, 3]
    }

    public static readonly PercentualStatNames: (keyof Stats)[] = [
        "blockRate",
        "blockReduction",
        "healRate",
        "criticalMultiplier",
        "criticalRate",
        "lifesteal",
        "dodgeRate"
    ]

    public isStackable() {
        return !this.isEquippable()
    }

    public isCraftable(): this is Item<T> & { data: { craft: CraftData }} {
        return !!this.data.craft
    }

    public isEquippable(): this is EquippableItem {
        return this.is(ItemType.Gear, ItemType.Spell)
    }

    public get gearType(): Nullable<GearType> {
        return this.isGear() ? this.data.gearType : null
    }

    public get weaponType(): Nullable<WeaponType> {
        return this.is(ItemType.Gear) ? this.data.weaponType ?? null : null
    }

    public get type() {
        return this.data.type as T
    }

    public is<T extends [...ItemType[]]>(...types: [...T]): this is Item<T[number]> {
        return types.includes(this.type)
    }

    public get price(): number {
        return this.data.price ?? this.data.craft?.requirements.items?.reduce((x, y) => x + y.item.price * y.amount, 0) ?? 0
    }

    public hasRequirements(player?: Player) {
        return Requirements.has(this.data.requirements, player)
    }

    public hasCraftRequirements(player?: Player, times?: number) {
        return Requirements.has(this.data.craft?.requirements, player, times)
    }

    public async craft(player: Player, times = 1): Promise<CraftItemResponse> {
        if (!this.isCraftable()) return { type: CraftItemResponseType.NotCraftable }

        const errors = this.hasCraftRequirements(player, times)
        if (errors !== true) return { type: CraftItemResponseType.MissingRequirements, errors }

        await Requirements.consume(player, this.data.craft.requirements.items!, times)

        let success = 0

        if (!this.data.craft?.chance)
            success = times
        else for (let i = 0; i < times; i++) {
            if (Util.isChance(this.data.craft.chance))
                success++
        }

        if (success === 0) return { type: CraftItemResponseType.Failure }

        const rewards = new Array<string>()

        const add = async () => {
            rewards.push(...(await player.give({
                rewards: {
                    items: [
                        {
                            item: this
                        }
                    ]
                },
                times: success
            })))
        }

        if (this.isStackable()) {
            await add()
        } else {
            for (let i = 0;i < success;i++) {
                // TODO: Try to use transactions
                await add()
            }
        }
        
        rewards.push(...(await player.give({
            rewards: this.data.craft.rewards,
            times: success
        })))

        return { type: CraftItemResponseType.Success, rewards, success, failed: times - success }
    }

    public getStat(name: keyof Stats): number {
        return this.isGear() ? this.data.stats[name] ?? 0 : 0
    }

    public getStats(): Stats {
        return Util.getStatsFrom(this)
    }

    public get equippable(): boolean {
        return this.isGear() || this.isSpell()
    }

    public static getStatCount(rarity: RarityType) {
        return rarity
    }

    public static getRandomStats(rarity: RarityType) {
        const arr = new Array<Omit<Prisma.RawItemStatUncheckedCreateInput, "itemUUID">>()

        const mult = Math.sqrt(rarity)

        for (let i = 0, len = Item.getStatCount(rarity); i < len; i++) {
            const rndStat = RandomStatKeys[Math.floor(Math.random() * RandomStatKeys.length)]
            const [min, max] = Item.RandomStatMinMax[rndStat]

            arr.push({
                type: rndStat,
                value: Formulas.random(min, max) * mult
            })
        }

        return arr
    }

    public static isPercentualStat(statName: keyof Stats) {
        return Item.PercentualStatNames.includes(statName)
    }

    public isGear(): this is GearItem {
        return this.is(ItemType.Gear)
    }

    public isSpell(): this is SpellItem {
        return this.is(ItemType.Spell)
    }

    public isMaterial(): this is MaterialItem {
        return this.is(ItemType.Material)
    }

    public isLootbox() {
        return this.is(ItemType.Lootbox)
    }

    public async open(player: Player, times?: number): Promise<LootboxOpenResponse> {
        if (!this.is(ItemType.Lootbox)) return { type: LootboxOpenResponseType.NotLootbox }
        
        const errors = this.hasRequirements(player)
        if (errors !== true) return { type: LootboxOpenResponseType.MissingRequirements, errors }

        const rewards = await player.give({ rewards: this.data.rewards, times })

        if (!rewards.length) return { type: LootboxOpenResponseType.Failed }

        return {
            type: LootboxOpenResponseType.Success,
            rewards
        }
    }

    public static formatStat(stat: keyof Stats, value: number) {
        return `${Util.camelToTitle(stat)} ${Item.formatStatValue(stat, value)}`
    }

    public static formatStatValue(stat: keyof Stats, value: number) {
        return Item.isPercentualStat(stat) ? `${Util.formatFloat(value)}%` : Util.formatInt(value)
    }
}

export const RandomStatKeys = Util.objectKeys(Item.RandomStatMinMax)

export type SpellItem = Item<ItemType.Spell>
export type MaterialItem = Item<ItemType.Material>
export type LootboxItem = Item<ItemType.Lootbox>
export type GearItem = Item<ItemType.Gear>
export type EquippableItem = GearItem | SpellItem