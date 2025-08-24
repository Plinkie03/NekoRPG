import {
	Action,
	Battle,
	ClassType,
	Entity,
	GetClassInstance,
	IResourceData,
	Resource,
	Round,
} from '@nekorpg'

export interface IEffectExecutionContext<
	T extends ClassType<Action>[] = ClassType<Action>[]
> {
	battle: Battle
	entity: Entity
	action?: GetClassInstance<T[number]>
	round: Round
	stacks: number
}

export interface IEffectData<
	T extends ClassType<Action>[] = ClassType<Action>[]
> extends IResourceData<number> {
	/**
	 * Makes this effect trigger on certain actions
	 */
	actions?: T

	/**
	 * This is the cooldown per tick
	 */
	cooldown?: number
	validate?: (this: Effect, ctx: IEffectExecutionContext<T>) => boolean
	tick: (this: Effect, ctx: IEffectExecutionContext<T>) => boolean
}

export class Effect<
	T extends ClassType<Action>[] = ClassType<Action>[]
> extends Resource<number, IEffectData> {
	public tick(ctx: IEffectExecutionContext<[...T]>) {
		return this.data.tick.call(this, ctx)
	}

	public validate(ctx: IEffectExecutionContext<[...T]>) {
		return this.data.validate?.call(this, ctx) ?? true
	}
}
