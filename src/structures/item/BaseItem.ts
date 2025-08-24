import {
	CraftBuilder,
	IResourceData,
	PlayerInventoryItem,
	Resource,
	Player,
	Util,
	ItemAddResponseType,
	UnreachableError,
} from '@nekorpg'

export interface ItemRequirementsData {
	craft?: CraftBuilder
}

export interface IBaseItemData extends IResourceData<number> {
	price?: number
	requirements?: ItemRequirementsData
}

export enum CraftItemResponseType {
	Success,
	NotCraftable,
	InventoryFull,
	MissingRequirements,
	Failed,
}

export type CraftItemResponse =
	| {
			type:
				| CraftItemResponseType.Failed
				| CraftItemResponseType.InventoryFull
				| CraftItemResponseType.NotCraftable
	  }
	| {
			type: CraftItemResponseType.MissingRequirements
			errors: string[]
	  }
	| {
			type: CraftItemResponseType.Success
			failed: number
			success: number
			item: PlayerInventoryItem
	  }

export abstract class BaseItem<
	T extends IBaseItemData = IBaseItemData
> extends Resource<number, T> {
	public get stackable() {
		return true
	}

	public get price(): number {
		return (
			this.data.price ??
			this.data.requirements?.craft?.data.requirements?.data.items?.reduce(
				(x, y) => x + y.item.price * (y.amount ?? 1),
				0
			) ??
			0
		)
	}

	public get equippable() {
		return !this.stackable
	}

	public craft(player: Player, times = 1): CraftItemResponse {
		if (!this.data.requirements?.craft) {
			return { type: CraftItemResponseType.NotCraftable }
		} else if (player.inventory.full) {
			return { type: CraftItemResponseType.Failed }
		} else {
			if (!this.stackable) {
				times = 1
			}

			const reqs = this.data.requirements.craft.data.requirements.has(
				player,
				times
			)
			if (reqs !== true) {
				return {
					type: CraftItemResponseType.MissingRequirements,
					errors: reqs,
				}
			}

			this.data.requirements.craft.data.requirements.consume(
				player,
				times
			)

			let success = 0,
				failed = 0

			for (let i = 0; i < times; i++) {
				if (
					!this.data.requirements.craft.data.chance ||
					!Util.isChance(this.data.requirements.craft.data.chance)
				) {
					success++
				} else {
					failed++
				}
			}

			if (!success) {
				return { type: CraftItemResponseType.Failed }
			}

			const result = player.inventory.add(this.id, success)

			if (result.type === ItemAddResponseType.Success) {
				return {
					type: CraftItemResponseType.Success,
					item: result.item,
					success,
					failed,
				}
			}

			throw new UnreachableError()
		}
	}
}
