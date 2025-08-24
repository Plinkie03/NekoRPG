import { Player, RequirementBuilder, RewardBuilder } from '@nekorpg'

export interface ICraftData {
	requirements: RequirementBuilder
	rewards?: RewardBuilder
	chance?: number
}

export class CraftBuilder {
	public readonly data = {} as ICraftData

	public requirements(requirements: RequirementBuilder) {
		this.data.requirements = requirements
		return this
	}

	public rewards(rewards: RewardBuilder) {
		this.data.rewards = rewards
		return this
	}

	public chance(chance: number) {
		this.data.chance = chance
		return this
	}

	public getMaxAmount(player: Player) {
		let max = 0

		for (const req of this.data.requirements!.data.items!) {
			const count = player.inventory.count(req.item.id)
			const total = Math.floor(count / req.amount)
			if (!max || total < max) {
				max = total
			}
		}

		return max
	}
}
