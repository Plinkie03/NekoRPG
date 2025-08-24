import { BaseItem } from '@nekorpg'

export interface ItemRewardData {
	item: BaseItem
	amount: number | [number, number]
	chance: number
}

export class ItemRewardBuilder extends Array<ItemRewardData> {
	public add(
		item: BaseItem,
		amount: ItemRewardData['amount'] = 1,
		chance = 1
	) {
		this.push({ item, amount, chance })
		return this
	}
}
