import {
	EntityBaseStats,
	Formatters,
	objectEntries,
	StatModifiers,
	Stats,
} from '@nekorpg'
import clone from 'clone-deep'

export type SkipFirstElement<T> = T extends [infer L, ...infer R] ? R : []
export type AddStatParams = SkipFirstElement<Parameters<StatBuilder['add']>>

export class StatBuilder {
	public static readonly Emojis: Partial<Record<keyof Stats, string>> = {
		archery: '<:archery:1406667507636633721>',
		archeryResistance: '<:archery_res:1406667530935865406>',
		blockRate: '<:block_rate:1406667847236849744>',
		blockReduction: '<:block_red:1406667826252484730>',
		criticalMultiplier: '<:crit_mult:1406667780014477453>',
		criticalRate: '<:crit_rate:1406667804790227075>',
		damageResistance: '<:dmg_res:1406667556382834778>',
		defense: '<:defense:1406667515790098503>',
		magic: '<:magic:1406668848765341716>',
		lifesteal: '<:lifesteal:1406667479412903946>',
		magicResistance: '<:magic_res:1406667549135077428>',
		maxHealth: '<:health:1406667523939893248>',
		maxMana: '<:mana:1406667865284939797>',
		melee: '<:melee:1406667485930983598>',
		meleeResistance: '<:melee_res:1406667542419865731>',
	}

	public constructor(public readonly data: Partial<StatModifiers> = {}) {}

	public add(
		stat: keyof Stats,
		absolute: number = 0,
		multiplier: number = 0
	) {
		if (this.data[stat]) {
			this.data[stat] = {
				absolute: (this.data[stat].absolute ?? 0) + absolute,
				multiplier: (this.data[stat].multiplier ?? 0) + multiplier,
			}
		} else {
			this.data[stat] = { absolute, multiplier }
		}

		return this
	}

	public damageResistance(multiplier: number) {
		return this.add('damageResistance', 0, multiplier)
	}

	public wounds(multiplier: number) {
		return this.add('wounds', 0, multiplier)
	}

	public lifesteal(multiplier: number) {
		return this.add('lifesteal', 0, multiplier)
	}

	public manasteal(multiplier: number) {
		return this.add('manasteal', 0, multiplier)
	}

	public crowdControlResistance(multiplier: number) {
		return this.add('crowdControlResistance', 0, multiplier)
	}

	public blockReduction(multiplier: number) {
		return this.add('blockReduction', 0, multiplier)
	}

	public blockRate(multiplier: number) {
		return this.add('blockRate', 0, multiplier)
	}

	public criticalMultiplier(multiplier: number) {
		return this.add('criticalMultiplier', 0, multiplier)
	}

	public criticalRate(multiplier: number) {
		return this.add('criticalRate', 0, multiplier)
	}

	public magicResistance(multiplier: number) {
		return this.add('magicResistance', 0, multiplier)
	}

	public meleeResistance(multiplier: number) {
		return this.add('meleeResistance', 0, multiplier)
	}

	public archeryResistance(multiplier: number) {
		return this.add('archeryResistance', 0, multiplier)
	}

	public magic(...params: AddStatParams) {
		return this.add('magic', ...params)
	}

	public archery(...params: AddStatParams) {
		return this.add('archery', ...params)
	}

	public melee(...params: AddStatParams) {
		return this.add('melee', ...params)
	}

	public maxMana(...params: AddStatParams) {
		return this.add('maxMana', ...params)
	}

	public maxHealth(...params: AddStatParams) {
		return this.add('maxHealth', ...params)
	}

	public defense(...params: AddStatParams) {
		return this.add('defense', ...params)
	}

	public clone() {
		return new StatBuilder(clone(this.data))
	}

	/**
	 *
	 * @param n
	 * @returns Creates a copy of this builder and returns it with the multiplied stats
	 */
	public multiply(n: number) {
		const stats: Partial<StatModifiers> = {}

		for (const [key, data] of objectEntries(this.data)) {
			if (!data) {
				continue
			}

			stats[key] = {
				absolute: Math.floor((data.absolute ?? 0) * n),
				multiplier: (data.multiplier ?? 0) * n,
			}
		}

		return new StatBuilder(stats)
	}

	public display() {
		const output = new Array<string>()

		for (const [key, data] of objectEntries(this.data)) {
			if (!data) {
				continue
			}

			const emoji = StatBuilder.Emojis[key]

			output.push(
				`${emoji ?? '(?)'}${
					EntityBaseStats.isAbsolute(key)
						? `${
								data.absolute
									? Formatters.int(data.absolute)
									: Formatters.percentual(data.multiplier!)
						  }${
								data.absolute && data.multiplier
									? ` (${Formatters.percentual(
											data.multiplier!
									  )})`
									: ''
						  }`
						: `${Formatters.percentual(data.multiplier!)}`
				}`
			)
		}

		return output.join(' ')
	}
}
