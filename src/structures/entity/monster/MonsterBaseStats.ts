import { EntityBaseStats, Monster } from '@nekorpg'

export class MonsterBaseStats extends EntityBaseStats<Monster> {
	public get maxHealth(): number {
		return this.entity.data.stats.data.maxHealth?.absolute ?? 0
	}

	public get maxMana(): number {
		return this.entity.data.stats.data.maxMana?.absolute ?? 0
	}

	public get melee(): number {
		return this.entity.data.stats.data.melee?.absolute ?? 0
	}

	public get archery(): number {
		return this.entity.data.stats.data.archery?.absolute ?? 0
	}

	public get magic(): number {
		return this.entity.data.stats.data.magic?.absolute ?? 0
	}

	public get defense(): number {
		return this.entity.data.stats.data.defense?.absolute ?? 0
	}

	public get blockRate(): number {
		return this.entity.data.stats.data.blockRate?.multiplier ?? 0
	}

	public get blockReduction(): number {
		return this.entity.data.stats.data.blockReduction?.multiplier ?? 0
	}

	public get criticalRate(): number {
		return this.entity.data.stats.data.criticalRate?.multiplier ?? 0
	}

	public get criticalMultiplier(): number {
		return this.entity.data.stats.data.criticalMultiplier?.multiplier ?? 0
	}

	public get wounds(): number {
		return 0
	}

	public get manasteal(): number {
		return this.entity.data.stats.data.manasteal?.multiplier ?? 0
	}

	public get lifesteal(): number {
		return this.entity.data.stats.data.lifesteal?.multiplier ?? 0
	}

	public get damageResistance(): number {
		return this.entity.data.stats.data.damageResistance?.multiplier ?? 0
	}

	public get crowdControlResistance(): number {
		return (
			this.entity.data.stats.data.crowdControlResistance?.multiplier ?? 0
		)
	}

	public get meleeResistance(): number {
		return this.entity.data.stats.data.meleeResistance?.multiplier ?? 0
	}

	public get archeryResistance(): number {
		return this.entity.data.stats.data.archeryResistance?.multiplier ?? 0
	}

	public get magicResistance(): number {
		return this.entity.data.stats.data.magicResistance?.multiplier ?? 0
	}
}
