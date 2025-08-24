import { EntityBaseStats, StatModifier, Stats } from '@nekorpg'

export class Formulas {
	private constructor() {}

	public static applyStatFormulaSimple(
		stat: keyof Stats,
		defaultValue: number,
		absolute?: number,
		multiplier?: number
	) {
		return Formulas.applyStatFormula(stat, defaultValue, {
			absolute,
			multiplier,
		})
	}

	public static applyStatFormula(
		stat: keyof Stats,
		defaultValue: number,
		modifier?: StatModifier
	) {
		return EntityBaseStats.isAbsolute(stat)
			? (defaultValue + (modifier?.absolute ?? 0)) *
					((modifier?.multiplier ?? 0) + 1)
			: defaultValue + (modifier?.multiplier ?? 0)
	}

	public static xpReq(level: number, base: number = 100): number {
		return ((level * (level + 1)) / 2) * base
	}

	public static randomFloat(max: number): number
	public static randomFloat(min: number, max: number): number
	public static randomFloat(min: number, max?: number): number
	public static randomFloat(min: number, max?: number) {
		return max !== undefined
			? Math.random() * (max - min) + min
			: Math.random() * min
	}

	public static randomInt(max: number): number
	public static randomInt(min: number, max: number): number
	public static randomInt(min: number, max?: number): number
	public static randomInt(min: number, max?: number) {
		return Math.floor(Formulas.randomFloat(min, max))
	}
}
