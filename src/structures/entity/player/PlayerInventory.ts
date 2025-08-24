import {
	PlayerInventoryItem,
	Player,
	Nullable,
	NekoResources,
	Rarity,
	Formulas,
	SkipFirstElement,
	Util,
} from '@nekorpg'
import { randomUUID } from 'crypto'
import { RawItem } from '../../../../prisma/generated/index.js'

export enum ItemDeleteResponseType {
	Success,
	Locked,
	Equipped,
}

export enum ItemAddResponseType {
	Success,
	Full,
}

export type ItemAddResponse =
	| {
			type: ItemAddResponseType.Full
	  }
	| {
			type: ItemAddResponseType.Success
			item: PlayerInventoryItem
	  }

export class PlayerInventory {
	public static readonly MaxSize = 50

	public constructor(public readonly player: Player) {}

	public get items() {
		return this.player.data.items.map(this._toInventoryItem.bind(this))
	}

	public get rawItems() {
		return this.player.data.items
	}

	public count(itemId: number) {
		return this.items.reduce(
			(x, y) => x + (y.data.id === itemId ? y.amount : 0),
			0
		)
	}

	public removeQuantity(itemId: number, amount: number) {
		if (this.count(itemId) < amount) {
			return false
		}

		for (const item of this.items.filter((x) => x.data.id === itemId)) {
			if ((amount -= item.decreaseAmount(amount)) === 0) break
		}

		return true
	}

	public at(index: number) {
		const item = this.rawAt(index)
		return item ? this._toInventoryItem(item) : null
	}

	public rawAt(index: number): Nullable<RawItem> {
		return this.rawItems[index] ?? null
	}

	public delete(item: PlayerInventoryItem): ItemDeleteResponseType {
		if (item.equipped) {
			return ItemDeleteResponseType.Equipped
		} else if (item.locked && item.amount !== 0) {
			return ItemDeleteResponseType.Locked
		}

		this.rawItems.splice(item.index!, 1)
		return ItemDeleteResponseType.Success
	}

	public get full() {
		return this.rawItems.length >= PlayerInventory.MaxSize
	}

	public deleteMany(items: PlayerInventoryItem[]) {
		return items.map(this.delete.bind(this))
	}

	public findById(itemId: number) {
		const raw = this.rawItems.find((x) => x.id === itemId)
		return raw ? this._toInventoryItem(raw) : null
	}

	public findByUUID(uuid?: Nullable<string>) {
		const raw = this.rawItems.find((x) => x.uuid === uuid)
		return raw ? this._toInventoryItem(raw) : null
	}

	public add(itemId: number, amount = 1, forceStack = true): ItemAddResponse {
		const item = NekoResources.Items.get(itemId)

		if (item.stackable && forceStack) {
			const ref = this.findById(itemId)
			if (!ref) {
				return this.add(itemId, amount, false)
			} else {
				ref.data.amount += amount
				return {
					type: ItemAddResponseType.Success,
					item: ref,
				}
			}
		} else {
			if (this.full) {
				return { type: ItemAddResponseType.Full }
			}

			const rarity = Rarity.random()

			const raw: RawItem = {
				amount,
				equipped: false,
				id: itemId,
				locked: false,
				multiplier: Formulas.randomFloat(
					rarity[1].multiplier[0],
					rarity[1].multiplier[1]
				),
				playerId: this.player.id,
				rarity: rarity[0],
				uuid: randomUUID(),
			}

			this.rawItems.push(raw)

			return {
				type: ItemAddResponseType.Success,
				item: this._toInventoryItem(raw),
			}
		}
	}

	public searchMany<Output = PlayerInventoryItem>(
		...params: SkipFirstElement<
			Parameters<
				typeof Util.searchMany<number, PlayerInventoryItem, Output>
			>
		>
	) {
		return Util.searchMany(this.items, ...params)
	}

	public searchOne<Output = PlayerInventoryItem>(
		...params: SkipFirstElement<
			Parameters<
				typeof Util.searchOne<number, PlayerInventoryItem, Output>
			>
		>
	) {
		return Util.searchOne(this.items, ...params)
	}

	private _toInventoryItem(data: RawItem) {
		return new PlayerInventoryItem(this.player, data)
	}
}
