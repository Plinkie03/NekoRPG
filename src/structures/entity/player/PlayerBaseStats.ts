import { EntityBaseStats, Stats, Player, Formulas } from '@nekorpg'

export class PlayerBaseStats extends EntityBaseStats<Player> {
	public get maxHealth(): number {
		return Math.floor(
			this.get('maxHealth', 100) * this.entity.skills.endurance.multiplier
		)
	}

	public get maxMana(): number {
		return Math.floor(
			this.get('maxMana', 100) * this.entity.skills.wisdom.multiplier
		)
	}

	public get melee(): number {
		return Math.floor(
			this.get('melee', 15) * this.entity.skills.melee.multiplier
		)
	}

	public get archery(): number {
		return Math.floor(
			this.get('archery', 20) * this.entity.skills.archery.multiplier
		)
	}

	public get magic(): number {
		return Math.floor(
			this.get('magic', 25) * this.entity.skills.magic.multiplier
		)
	}

	public get defense(): number {
		return Math.floor(
			this.get('defense', 5) * this.entity.skills.defense.multiplier
		)
	}

	public get blockRate(): number {
		return this.get('blockRate', 0.1)
	}

	public get blockReduction(): number {
		return this.get('blockReduction', 0.25)
	}

	public get criticalRate(): number {
		return this.get('criticalRate', 0.1)
	}

	public get criticalMultiplier(): number {
		return this.get('criticalMultiplier', 1.5)
	}

	public get wounds(): number {
		return this.get('wounds', 0)
	}

	public get manasteal(): number {
		return this.get('manasteal', 0)
	}

	public get lifesteal(): number {
		return this.get('lifesteal', 0)
	}

	public get damageResistance(): number {
		return this.get('damageResistance', 0)
	}

	public get crowdControlResistance(): number {
		return this.get('crowdControlResistance', 0)
	}

	public get meleeResistance(): number {
		return this.get('meleeResistance', 0)
	}

	public get archeryResistance(): number {
		return this.get('archeryResistance', 0)
	}

	public get magicResistance(): number {
		return this.get('magicResistance', 0)
	}

	public get(stat: keyof Stats, defaultValue: number) {
		return Formulas.applyStatFormula(
			stat,
			defaultValue,
			this.entity.gear.stats[stat]
		)
	}
}
