import {
	StatBuilder,
	SkillRequirementBuilder,
	ItemRequirementBuilder,
	Player,
	SkillType,
	objectEntries,
	Formatters,
} from '@nekorpg'

export interface IRequirementData {
	level?: number
	stats?: StatBuilder
	skills?: SkillRequirementBuilder
	items?: ItemRequirementBuilder
}

export class RequirementBuilder {
	public readonly data: IRequirementData = {}

	public items(builder: ItemRequirementBuilder) {
		this.data.items = builder
		return this
	}

	public skills(builder: SkillRequirementBuilder) {
		this.data.skills = builder
		return this
	}

	public level(n: number) {
		this.data.level = n
		return this
	}

	public stats(builder: StatBuilder) {
		this.data.stats = builder
		return this
	}

	public consume(player?: Player, times = 1) {
		if (this.data.items) {
			for (const reqItem of this.data.items) {
				player?.inventory.removeQuantity(
					reqItem.item.id,
					reqItem.amount * times
				)
			}
		}
	}

	public has(player?: Player, times = 1) {
		const output = new Array<string>()

		if (this.data.level && (!player || player.level < this.data.level)) {
			output.push(`Level ${Formatters.int(this.data.level)}`)
		}

		if (this.data.items?.length) {
			for (const reqItem of this.data.items) {
				if (
					!player ||
					player.inventory.count(reqItem.item.id) <
						reqItem.amount * times
				) {
					output.push(
						`${reqItem.item} ${Formatters.multiplier(
							reqItem.amount * times
						)}`
					)
				}
			}
		}

		if (this.data.skills?.length) {
			for (const reqSkill of this.data.skills) {
				if (
					!player ||
					player.skills.get(reqSkill.type).level < reqSkill.level
				) {
					output.push(
						`${SkillType[reqSkill.type]} Level ${Formatters.int(
							reqSkill.level
						)}`
					)
				}
			}
		}

		if (this.data.stats) {
			for (const [statName, statValue] of objectEntries(
				this.data.stats.data
			)) {
				if (
					!player ||
					player.stats.base[statName] < statValue?.absolute!
				) {
					output.push(
						`${Formatters.toTitleCase(
							statName
						)} Stat ${Formatters.int(statValue?.absolute!)}`
					)
				}
			}
		}

		return output.length === 0 ? true : output
	}
}
