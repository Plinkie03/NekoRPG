import {
	StatModifier,
	Entity,
	EntityBaseStats,
	Stats,
	Formulas,
	Info,
	StatBuilder,
	Effect,
} from '@nekorpg'
import { Collection } from 'discord.js'

export interface IDuratable {
	id: unknown
	duration: number
}

export interface ITemporaryStatModifier extends IDuratable {
	stat: keyof Stats
	modifier: StatModifier
}

export enum CooldownType {
	Spell,
	Passive,
	Effect,
}

export interface IAilmentData extends IDuratable {
	effect: Effect
	stacks: number
}

export abstract class EntityModdedStats<
	T extends Entity
> extends EntityBaseStats<T> {
	public readonly modifiers = new Collection<
		unknown,
		ITemporaryStatModifier
	>()

	public readonly ailments = new Collection<number, IAilmentData>()

	public readonly cooldowns = new Collection<
		CooldownType,
		Collection<number, IDuratable>
	>()

	public stunDuration = 0

	public get archery(): number {
		return this.get('archery')
	}

	public get archeryResistance(): number {
		return this.get('archeryResistance')
	}

	public get blockRate(): number {
		return this.get('blockRate')
	}

	public get blockReduction(): number {
		return this.get('blockReduction')
	}

	public get criticalMultiplier(): number {
		return this.get('criticalMultiplier')
	}

	public get criticalRate(): number {
		return this.get('criticalRate')
	}

	public get crowdControlResistance(): number {
		return this.get('crowdControlResistance')
	}

	public get damageResistance(): number {
		return this.get('damageResistance')
	}

	public get defense(): number {
		return this.get('defense')
	}

	public get lifesteal(): number {
		return this.get('lifesteal')
	}

	public get magic(): number {
		return this.get('magic')
	}

	public get magicResistance(): number {
		return this.get('magicResistance')
	}

	public get manasteal(): number {
		return this.get('manasteal')
	}

	public get maxHealth(): number {
		return this.get('maxHealth')
	}

	public get maxMana(): number {
		return this.get('maxMana')
	}

	public get melee(): number {
		return this.get('melee')
	}

	public get meleeResistance(): number {
		return this.get('meleeResistance')
	}

	public get wounds(): number {
		return this.get('wounds')
	}

	public get strength(): number {
		return this.get(this.entity.stats.offensiveStat)
	}

	public getCooldowns(type: CooldownType) {
		return this.cooldowns.ensure(
			type,
			() => new Collection<number, IDuratable>()
		)
	}

	public addEffectCooldown(effectId: number, cd: number) {
		this.getCooldowns(CooldownType.Effect).set(effectId, {
			duration: cd,
			id: effectId,
		})
	}

	public hasEffectCooldown(effectId: number) {
		return this.getCooldowns(CooldownType.Effect).has(effectId)
	}

	public addPassiveCooldown(passiveId: number, cd: number) {
		this.getCooldowns(CooldownType.Passive).set(passiveId, {
			duration: cd,
			id: passiveId,
		})
	}

	public hasPassiveCooldown(passiveId: number) {
		return this.getCooldowns(CooldownType.Passive).has(passiveId)
	}

	public addSpellCooldown(spellId: number, cd: number) {
		this.getCooldowns(CooldownType.Spell).set(spellId, {
			duration: cd,
			id: spellId,
		})
	}

	public hasSpellCooldown(spellId: number) {
		return this.getCooldowns(CooldownType.Spell).has(spellId)
	}

	public removeSpellCooldown(spellId: number) {
		this.getCooldowns(CooldownType.Spell).delete(spellId)
	}

	public addModifier(modifier: ITemporaryStatModifier) {
		this.modifiers.set(modifier.id, modifier)
	}

	public hasModifier(modifierId: unknown) {
		return this.modifiers.has(modifierId)
	}

	public addAilment(effect: Effect, duration: number) {
		if (this.ailments.has(effect.id)) {
			const existing = this.ailments.get(effect.id)!
			existing.stacks++
			existing.duration = duration
		} else {
			this.ailments.set(effect.id, {
				duration,
				effect,
				id: effect.id,
				stacks: 1,
			})
		}
	}

	public removeAilment(effectId: number) {
		this.ailments.delete(effectId)
	}

	public removeAilments() {
		this.ailments.clear()
	}

	public removeModifier(modifierId: unknown) {
		this.modifiers.delete(modifierId)
	}

	public removeModifiers(stat?: keyof Stats) {
		for (const [id, { stat: otherStat }] of this.modifiers) {
			if (!stat || stat === otherStat) {
				this.removeModifier(id)
			}
		}
	}

	public get(stat: keyof Stats) {
		const baseValue = this.entity.stats.base[stat]
		const modifier = this.modifiers.reduce(
			(acc, curr) =>
				curr.stat === stat
					? {
							absolute:
								acc.absolute + (curr.modifier.absolute ?? 0),
							multiplier:
								acc.multiplier +
								(curr.modifier.multiplier ?? 0),
					  }
					: acc,
			{ multiplier: 0, absolute: 0 }
		)
		const finalValue = Formulas.applyStatFormula(stat, baseValue, modifier)
		return EntityModdedStats.isAbsolute(stat)
			? Math.floor(finalValue)
			: finalValue
	}

	public tick() {
		this._tickDuratable(this.modifiers)
		this._tickAilments()
		this.cooldowns.forEach(this._tickDuratable.bind(this))
		this.stunDuration = Math.max(0, this.stunDuration - 1)
	}

	public reset() {
		this.modifiers.clear()
		this.cooldowns.clear()
		this.ailments.clear()
		this.stunDuration = 0
	}

	public isStunned() {
		return this.stunDuration !== 0
	}

	public stun(dur: number) {
		if (this.isStunned()) {
			return false
		}

		this.stunDuration = dur
		return true
	}

	private _tickAilments() {
		for (const ailment of this.ailments.values()) {
			if (
				ailment.effect.data.actions?.length ||
				(ailment.effect.data.cooldown &&
					this.hasEffectCooldown(ailment.effect.data.cooldown))
			) {
				continue
			}

			const result = ailment.effect.tick({
				battle: this.entity.battle!,
				entity: this.entity,
				round: this.entity.battle?.getLastRound()!,
				stacks: ailment.stacks,
			})

			if (result && ailment.effect.data.cooldown) {
				this.addEffectCooldown(
					ailment.effect.id,
					ailment.effect.data.cooldown
				)
			}
		}

		// Tick them
		this._tickDuratable(this.ailments)
	}

	private _tickDuratable<K, V extends IDuratable>(table: Collection<K, V>) {
		for (const [key, value] of table) {
			if (value.duration !== -1 && !--value.duration) {
				table.delete(key)
				this.entity.battle?.getLastRound()?.add(Info, {
					entity: this.entity,
					text: `${this.entity}'s ${value.id} has just run out!`,
				})
			}
		}
	}

	public getStatModifiers(): StatBuilder {
		const builder = new StatBuilder()

		for (const stat of this.modifiers) {
			builder.add(
				stat[1].stat,
				stat[1].modifier.absolute,
				stat[1].modifier.multiplier
			)
		}

		return builder
	}
}
