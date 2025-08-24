import {
	Entity,
	EntitySpell,
	Enum,
	Formulas,
	Fortification,
	Hit,
	Info,
	Monster,
	Nullable,
	Player,
	Resource,
	Round,
	SpellCast,
	Util,
} from '@nekorpg'

export enum BattleOptionType {
	Attack,
	Defend,
	Focus,
	Spell,
	Charge,
	Skip,
}

export const BattleModifierNames = {
	Defend: 'Block',
	Charge_1: 'Charge (1)',
	Charge_2: 'Charge (2)',
	Focus: 'Focus',
} as const

export type BattleOption =
	| {
			type:
				| BattleOptionType.Attack
				| BattleOptionType.Defend
				| BattleOptionType.Charge
				| BattleOptionType.Focus
				| BattleOptionType.Skip
	  }
	| {
			type: BattleOptionType.Spell
			spell: EntitySpell
	  }

export class Battle {
	public rounds = new Array<Round>()

	public constructor(public readonly entities: [Entity, Entity]) {
		this.entities.forEach((x) => x.prepare(this))
	}

	public getCurrentEntity() {
		return this.entities[this.rounds.length % this.entities.length]
	}

	/**
	 * This creates a new empty round.
	 * @returns The created round, its also appended to rounds.
	 */
	public getCurrentRound() {
		const round = new Round(this, this.getCurrentEntity())
		this.rounds.push(round)
		return round
	}

	public getLastRound() {
		return this.rounds.at(-1) ?? null
	}

	public getWinner() {
		const alive = this.entities.filter((x) => !x.isDead())
		return alive.length === 1 ? alive[0] : null
	}

	public getLoser() {
		const winner = this.getWinner()
		return winner ? this.entities.find((x) => x !== winner)! : null
	}

	public getEnemy(of: Entity) {
		return this.entities.find((x) => x !== of)!
	}

	public getMonster(): Monster {
		return this.entities.find((x) => x instanceof Monster)!
	}

	public getPlayer(): Player {
		return this.entities.find((x) => x instanceof Player)!
	}

	public isActive() {
		return this.getWinner() === null
	}

	public isAITurn() {
		return this.getCurrentEntity() instanceof Monster
	}

	public advance(option?: BattleOption) {
		const round = this.getCurrentRound()
		option ??= this.pick(round.entity)

		if (round.entity.stats.modded.isStunned()) {
			round.add(Info, {
				entity: round.entity,
				text: `${round.entity} is stunned! They can't do anything`,
			})
		} else {
			switch (option.type) {
				case BattleOptionType.Spell: {
					const cast = round.add(SpellCast, {
						entity: round.entity,
						spell: option.spell,
					})
					option.spell.execute(cast)
					break
				}

				case BattleOptionType.Attack: {
					round.add(Hit, { entity: round.entity })
					break
				}

				case BattleOptionType.Defend: {
					round.add(Info, {
						entity: round.entity,
						text: `${round.entity} is now defending!`,
					})

					round.add(Fortification, {
						duration: 2,
						entity: round.entity,
						id: BattleModifierNames.Defend,
						modifier: { multiplier: 1 },
						stat: 'defense',
					})
					break
				}

				case BattleOptionType.Skip: {
					round.add(Info, {
						entity: round.entity,
						text: `${round.entity} skipped their turn`,
					})
					break
				}

				case BattleOptionType.Charge: {
					round.add(Info, {
						entity: round.entity,
						text: `${round.entity} is charging...`,
					})

					round.add(Fortification, {
						duration: 3,
						entity: round.entity,
						id: BattleModifierNames.Charge_1,
						modifier: { multiplier: 4 },
						stat: round.entity.stats.offensiveStat,
					})

					round.add(Fortification, {
						duration: 3,
						entity: round.entity,
						id: BattleModifierNames.Charge_2,
						modifier: { multiplier: -1 },
						stat: 'defense',
					})
					break
				}

				case BattleOptionType.Focus: {
					round.add(Info, {
						entity: round.entity,
						text: `${round.entity} is focusing...`,
					})

					round.add(Fortification, {
						duration: 3,
						entity: round.entity,
						id: BattleModifierNames.Focus,
						modifier: { multiplier: 2 },
						stat: round.entity.stats.offensiveStat,
					})
				}
			}
		}

		this.entities.forEach((x) => x.stats.modded.tick())
		round.advance()
	}

	public pick(entity: Entity): BattleOption {
		const spell = entity.getSpells().filter((x) => x.castable)[0]

		if (spell) {
			return {
				type: BattleOptionType.Spell,
				spell,
			}
		} else if (
			entity.stats.modded.hasModifier(BattleModifierNames.Focus) ||
			entity.stats.modded.hasModifier(BattleModifierNames.Focus)
		) {
			return {
				type: BattleOptionType.Attack,
			}
		} else if (
			entity.stats.modded.hasModifier(BattleModifierNames.Defend)
		) {
			return {
				type: Util.isChance(0.5)
					? BattleOptionType.Focus
					: BattleOptionType.Charge,
			}
		}

		return {
			type: Enum.random(
				BattleOptionType,
				BattleOptionType.Skip,
				BattleOptionType.Spell
			) as Exclude<BattleOptionType, BattleOptionType.Spell>,
		}
	}
}
