import {
	BaseItem,
	Player,
	NekoResources,
	StatModifiers,
	Rarity,
	RarityType,
	objectEntries,
	GearItem,
	StatBuilder,
	SkillType,
	Formatters,
} from '@nekorpg'
import { RawItem } from '../../../../prisma/generated/index.js'

export class PlayerInventoryItem<T extends BaseItem = BaseItem> {
	public constructor(
		public readonly player: Player,
		public readonly data: RawItem
	) {}

	public get index() {
		const index = this.player.data.items.findIndex(
			(x) => x.uuid === this.uuid
		)
		return index === -1 ? null : index
	}

	public get item() {
		return NekoResources.Items.get(this.data.id) as T
	}

	public get locked() {
		return this.data.locked ?? false
	}

	public get equipped() {
		return this.data.equipped ?? false
	}

	public get amount() {
		return this.data.amount
	}

	public set amount(value: number) {
		this.data.amount = value
		if (value === 0) {
			this.delete()
		}
	}

	public get uuid() {
		return this.data.uuid
	}

	public delete() {
		return this.player.inventory.delete(this)
	}

	public decreaseAmount(by: number) {
		by = Math.min(by, this.amount)
		this.amount = this.amount - by
		return by
	}

	public increaseAmount(by: number) {
		this.amount = this.amount + by
		return by
	}

	public get rarity() {
		return [
			this.data.rarity as RarityType,
			Rarity.get(this.data.rarity ?? RarityType.Common),
		] as const
	}

	public get multiplier() {
		return this.data.multiplier ?? 0
	}

	public get stats() {
		return this.item instanceof GearItem
			? this.item.stats.multiply(this.multiplier)
			: null
	}

	public get name() {
		return `${
			this.item.stackable
				? ''
				: `[${RarityType[this.rarity[0]]}(${Formatters.multiplier(
						this.multiplier
				  )})] `
		}${this.item}`
	}

	public get id() {
		return this.data.id
	}

	public toString() {
		return `${this.name}${this.stats ? ` ${this.stats.display()}` : ''}`
	}
}
