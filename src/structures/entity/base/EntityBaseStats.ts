import { append, Entity, WeaponType } from '@nekorpg'

export type Stats = {
	-readonly [P in keyof EntityBaseStats as EntityBaseStats[P] extends number
		? P
		: never]: EntityBaseStats[P]
}

export type StatModifiers = {
	[P in keyof Stats]: StatModifier
}

export type StatModifier = {
	absolute?: number
	multiplier?: number
}

export abstract class EntityBaseStats<T extends Entity = Entity> {
	protected static readonly _AbsoluteStats: Array<keyof Stats> = [
		'maxHealth',
		'maxMana',
		'archery',
		'melee',
		'magic',
		'defense',
	]

	public constructor(public readonly entity: T) {}

	public abstract get maxHealth(): number
	public abstract get maxMana(): number
	public abstract get melee(): number
	public abstract get archery(): number
	public abstract get magic(): number
	public abstract get defense(): number
	public abstract get blockRate(): number
	public abstract get blockReduction(): number
	public abstract get criticalRate(): number
	public abstract get criticalMultiplier(): number
	public abstract get wounds(): number
	public abstract get manasteal(): number
	public abstract get lifesteal(): number
	public abstract get damageResistance(): number
	public abstract get crowdControlResistance(): number
	public abstract get meleeResistance(): number
	public abstract get archeryResistance(): number
	public abstract get magicResistance(): number

	public get strength(): number {
		return this[this.entity.stats.offensiveStat]
	}

	public static isAbsolute(stat: keyof Stats) {
		return EntityBaseStats._AbsoluteStats.includes(stat)
	}
}
