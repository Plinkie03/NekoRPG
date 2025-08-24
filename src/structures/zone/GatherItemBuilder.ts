import { BaseItem, ItemRewardBuilder, RewardBuilder } from '@nekorpg'

export interface IGatherItemData {
	item: BaseItem
	baseChance: number
	maxChance: number
	modifierChance: number
	rewards: RewardBuilder
	baseAmount: number
	maxAmount: number
	modifierAmount: number
}

export class GatherItemBuilder {
	public readonly data = {} as IGatherItemData

	public constructor(item: BaseItem) {
		this.data.item = item
	}

	public chance(base = 1, max = 1, modifier = 0.01) {
		this.data.baseChance = base
		this.data.maxChance = max
		this.data.modifierChance = modifier
		return this
	}

	public amount(base = 1, max = 1, modifier = 0.2) {
		this.data.baseAmount = base
		this.data.maxAmount = max
		this.data.modifierAmount = modifier
		return this
	}

	public rewards(rewards: RewardBuilder) {
		this.data.rewards = rewards

		// Append the item to the reward
		rewards.items(new ItemRewardBuilder().add(this.data.item, 1))

		return this
	}
}
