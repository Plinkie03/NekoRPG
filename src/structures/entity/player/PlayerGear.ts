import {
	Nullable,
	PlayerInventoryItem,
	GearItem,
	GearType,
	StatModifiers,
	Player,
	objectEntries,
} from '@nekorpg'

export enum EquipItemResponseType {
	Success,
	AlreadyEquipped,
	NotEquippable,
	MissingRequirements,
}

export type EquipItemResponse =
	| {
			type:
				| EquipItemResponseType.AlreadyEquipped
				| EquipItemResponseType.NotEquippable
	  }
	| {
			type: EquipItemResponseType.MissingRequirements
			errors: string[]
	  }
	| {
			type: EquipItemResponseType.Success
			old: Nullable<PlayerInventoryItem>
	  }

export enum UnequipItemResponseType {
	Success,
	NotFound,
	NotEquipped,
}

export type UnequipItemResponse =
	| {
			type:
				| UnequipItemResponseType.NotEquipped
				| UnequipItemResponseType.Success
			item: PlayerInventoryItem<GearItem>
	  }
	| {
			type: UnequipItemResponseType.NotFound
	  }

export class PlayerGear {
	private _gearCache?: Partial<
		Record<GearType, PlayerInventoryItem<GearItem>>
	>
	private _statCache?: Partial<StatModifiers>

	public constructor(public readonly player: Player) {}

	public get equipped() {
		if (this._gearCache) {
			return this._gearCache
		}

		const cache: PlayerGear['_gearCache'] = {}

		for (const invItem of this.player.inventory.items) {
			if (invItem.equipped && invItem.item instanceof GearItem) {
				cache[invItem.item.data.gearType] =
					invItem as PlayerInventoryItem<GearItem>
			}
		}

		return (this._gearCache = cache)
	}

	public get stats() {
		if (this._statCache) {
			return this._statCache
		}

		const cache: PlayerGear['_statCache'] = {}

		for (const invItem of this.toArray()) {
			for (const [stat, modifier] of objectEntries(
				invItem.item.stats.data
			)) {
				if (!cache[stat]) {
					cache[stat] = {
						absolute: 0,
						multiplier: 0,
					}
				}

				cache[stat].absolute! += modifier!.absolute ?? 0
				cache[stat].multiplier! += modifier!.multiplier ?? 0
			}
		}

		return (this._statCache = cache)
	}

	public get(type: GearType) {
		return this.equipped[type] ?? null
	}

	public get weapon() {
		return this.get(GearType.Weapon)
	}

	public toArray() {
		return Object.values(this.equipped)
	}

	public equip(item: PlayerInventoryItem<GearItem>): EquipItemResponse {
		if (item.equipped) {
			return { type: EquipItemResponseType.AlreadyEquipped }
		} else if (!(item.item instanceof GearItem)) {
			return { type: EquipItemResponseType.NotEquippable }
		}

		const reqs = item.item.data.requirements?.equip?.has(this.player)
		if (Array.isArray(reqs)) {
			return {
				type: EquipItemResponseType.MissingRequirements,
				errors: reqs,
			}
		}

		const current = this.get(item.item.gearType)

		item.data.equipped = true
		if (current) {
			current.data.equipped = false
		}

		this._clearCache()

		return {
			type: EquipItemResponseType.Success,
			old: current ?? null,
		}
	}

	public unequip(type: GearType): UnequipItemResponse {
		const current = this.get(type)

		if (!current) {
			return { type: UnequipItemResponseType.NotFound }
		} else if (!current.equipped) {
			return {
				type: UnequipItemResponseType.NotEquipped,
				item: current,
			}
		}

		current.data.equipped = false

		this._clearCache()

		return {
			type: UnequipItemResponseType.Success,
			item: current,
		}
	}

	private _clearCache() {
		delete this._gearCache
		delete this._statCache
	}
}
