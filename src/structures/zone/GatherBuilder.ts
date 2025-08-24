import {
	BaseItem,
	Formulas,
	GatherItemBuilder,
	Player,
	RequirementBuilder,
	SkillType,
	Util,
} from '@nekorpg'

export interface IGatherData {
	skill: SkillType
	requirements?: RequirementBuilder
}

export class GatherBuilder extends Array<GatherItemBuilder> {
	public readonly data = {} as IGatherData

	public constructor(skill: SkillType) {
		super()
		this.data.skill = skill
	}

	public requirements(reqs: RequirementBuilder) {
		this.data.requirements = reqs
		return this
	}

	public add(gather: GatherItemBuilder) {
		this.push(gather)
		return this
	}

	public consume(player: Player) {
		const output = new Array<string>()

		for (const gatherItem of this) {
			const level = player.skills.get(this.data.skill).level
			const chance = this.getChance(level, gatherItem)
			const amount = Formulas.randomInt(
				1,
				this.getAmount(level, gatherItem)
			)

			if (!Util.isChance(chance)) {
				continue
			}

			output.push(...gatherItem.data.rewards.consume(player, amount))
		}

		return output
	}

	public getChance(level: number, gatherItem: GatherItemBuilder) {
		return Math.min(
			gatherItem.data.maxChance,
			Math.max(
				gatherItem.data.baseChance,
				gatherItem.data.baseChance +
					this.getLevelDifference(level) *
						gatherItem.data.modifierChance
			)
		)
	}

	public getAmount(level: number, gatherItem: GatherItemBuilder) {
		return Math.floor(
			Math.min(
				gatherItem.data.maxAmount,
				Math.max(
					gatherItem.data.baseAmount,
					gatherItem.data.baseAmount +
						this.getLevelDifference(level) *
							gatherItem.data.modifierAmount
				)
			)
		)
	}

	public getLevelDifference(level: number) {
		return (
			level -
			(this.data.requirements?.data.skills?.find(
				(x) => x.type === this.data.skill
			)?.level ?? 0)
		)
	}
}
