import {
	ClassType,
	Entity,
	GetClassInstance,
	IEffectExecutionContext,
	IPassiveExecutionContext,
	ISpellExecutionContext,
	Round,
	SkipFirstElement,
	Util,
} from '@nekorpg'

export interface IActionData {
	round: Round
	entity: Entity
}

export abstract class Action<T extends IActionData = IActionData> {
	public readonly tags = new Array<string>()
	public readonly actions = new Array<Action>()

	private _canceled = false

	public get canceled() {
		return this._canceled
	}

	public set canceled(n: boolean) {
		this._canceled = n
	}

	public constructor(public readonly data: T) {}

	public get entity() {
		return this.data.entity
	}

	public get battle() {
		return this.round.battle
	}

	public get target() {
		return this.battle.getEnemy(this.entity)
	}

	public get round() {
		return this.data.round
	}

	public addAndReturn<T extends ClassType<Action>>(
		action: T,
		data: Omit<ConstructorParameters<T>[0], 'round'>
	) {
		const result = new action({ round: this.round, ...data })
		this.actions.push(result)
		return result as GetClassInstance<T>
	}

	public add<T extends ClassType<Action>>(
		action: T,
		data: Omit<ConstructorParameters<T>[0], 'round'>
	) {
		const result = new action({ round: this.round, ...data })
		this.actions.push(result)
		return this
	}

	public execute() {
		// Passives popping up!
		for (const entity of this.battle.entities) {
			const passiveData: IPassiveExecutionContext = {
				battle: this.battle,
				action: this,
				entity,
				round: this.round,
				target: this.battle.getEnemy(entity),
			}

			for (const passive of entity.getPassives()) {
				if (
					!entity.stats.modded.hasPassiveCooldown(passive.id) &&
					(!passive.data.actions?.length ||
						passive.data.actions.some((x) =>
							Util.isClass(this, x)
						)) &&
					passive.validate(passiveData) &&
					passive.execute(passiveData)
				) {
					if (passive.appendTag) {
						this.tags.push(passive.displayName)
					}

					if (passive.data.cooldown) {
						entity.stats.modded.addPassiveCooldown(
							passive.id,
							passive.data.cooldown
						)
					}
				}
			}

			if (this.canceled) {
				return
			}

			for (const ailment of entity.stats.modded.ailments.values()) {
				const ailmentData: IEffectExecutionContext = {
					...passiveData,
					stacks: ailment.stacks,
				}

				if (
					ailment.effect.data.actions?.some((x) =>
						Util.isClass(this, x)
					) &&
					ailment.effect.validate(ailmentData) &&
					ailment.effect.tick(ailmentData)
				) {
					// Nothing, effects that active on certain actions do not have cooldown
				}
			}
		}

		if (this.canceled) {
			return
		}

		this.beforeExecute()

		for (const action of this.actions) {
			action.execute()
		}
	}

	public toString() {
		return `${
			!this.tags.length
				? ''
				: ` ${this.tags.map((x) => `[${x}]`).join(' ')}`
		}${this.canceled ? ` [CANCELED]` : ''}`
	}
	public abstract beforeExecute(): void

	public static format(actions: Action[], spacing = 0): string {
		return actions
			.map(
				(x) =>
					`${'**|** '.repeat(spacing)}${x}${
						x.actions.length
							? `\n${Action.format(x.actions, spacing + 1)}`
							: ''
					}`
			)
			.join('\n')
	}
}
