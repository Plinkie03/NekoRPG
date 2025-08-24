import { BaseItem } from '@nekorpg'

export interface ItemRequirementData {
	item: BaseItem
	amount: number
}

export class ItemRequirementBuilder extends Array<ItemRequirementData> {
	public add(item: BaseItem, amount = 1) {
		this.push({ item, amount })
		return this
	}
}
