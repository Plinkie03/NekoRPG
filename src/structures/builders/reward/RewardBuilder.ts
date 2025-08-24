import {
	Formatters,
	Formulas,
	ItemAddResponseType,
	ItemRewardBuilder,
	Player,
	SkillRewardBuilder,
	SkillType,
	Util,
} from '@nekorpg'

export interface IRewardData {
	items?: ItemRewardBuilder
	skills?: SkillRewardBuilder
	xp?: number
	money?: number
	gems?: number
}

export class RewardBuilder {
	public readonly data: IRewardData = {}

	public items(builder: ItemRewardBuilder) {
		this.data.items = builder
		return this
	}

	public skills(builder: SkillRewardBuilder) {
		this.data.skills = builder
		return this
	}

	public xp(n: number) {
		this.data.xp = n
		return this
	}

	public money(n: number) {
		this.data.money = n
		return this
	}

	public gems(n: number) {
		this.data.gems = n
		return this
	}

	public consume(player?: Player, multiplier = 1) {
		const output = new Array<string>()

		if (this.data.money) {
			player?.addMoney(this.data.money * multiplier)
			output.push(`+$${Formatters.int(this.data.money * multiplier)}`)
		}

		if (this.data.gems) {
			player?.addGems(this.data.gems * multiplier)
			output.push(`+${Formatters.int(this.data.gems * multiplier)} Gems`)
		}

		if (this.data.xp) {
			const levelup = player?.addXp(this.data.xp * multiplier)
			output.push(
				`+${Formatters.int(this.data.xp * multiplier)} XP${
					levelup
						? ` (You are now level ${Formatters.int(
								player!.level
						  )}!)`
						: ''
				}`
			)
		}

		if (this.data.items?.length) {
			for (const rewardItem of this.data.items) {
				if (Util.isChance(rewardItem.chance) || !player) {
					const rngAmount =
						typeof rewardItem.amount === 'number'
							? rewardItem.amount * multiplier
							: Formulas.randomInt(
									rewardItem.amount[0] * multiplier,
									rewardItem.amount[1] * multiplier
							  )

					const result = player?.inventory.add(
						rewardItem.item.id,
						rngAmount
					)

					output.push(
						`${
							result?.type === ItemAddResponseType.Success
								? result.item
								: rewardItem.item
						} ${
							player
								? Formatters.multiplier(rngAmount)
								: Array.isArray(rewardItem.amount)
								? `${Formatters.multiplier(
										rewardItem.amount[0] * multiplier
								  )}-${Formatters.multiplier(
										rewardItem.amount[1] * multiplier
								  )}`
								: Formatters.multiplier(
										rewardItem.amount * multiplier
								  )
						}${
							result
								? result.type === ItemAddResponseType.Full
									? ` (LOST)`
									: ''
								: ` (${Formatters.percentual(
										rewardItem.chance
								  )})`
						}`
					)
				}
			}
		}

		if (this.data.skills?.length) {
			for (const rewardSkill of this.data.skills) {
				const levelup = player?.skills
					.get(rewardSkill.type)
					.addXp(rewardSkill.xp * multiplier)
				output.push(
					`+${Formatters.int(rewardSkill.xp * multiplier)} ${
						SkillType[rewardSkill.type]
					} XP${
						levelup
							? ` (Your ${
									SkillType[rewardSkill.type]
							  } is now level ${Formatters.int(
									player!.skills.get(rewardSkill.type).level
							  )}!)`
							: ''
					}`
				)
			}
		}

		return output
	}
}
