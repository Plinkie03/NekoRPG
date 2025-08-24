import {
	Action,
	Battle,
	ClassType,
	Entity,
	GetClassInstance,
	Hit,
	IResourceData,
	Resource,
	Round,
} from '@nekorpg'

export interface IPassiveExecutionContext<
	T extends ClassType<Action>[] = ClassType<Action>[]
> {
	action: GetClassInstance<T[number]>
	round: Round
	battle: Battle
	entity: Entity
	target: Entity
}

export interface IPassiveData<T extends ClassType<Action>[]>
	extends IResourceData<number> {
	appendTag?: boolean
	actions?: T
	cooldown?: number
	validate?: (this: Passive, ctx: IPassiveExecutionContext<T>) => boolean
	execute: (this: Passive, ctx: IPassiveExecutionContext<T>) => boolean
}

export class Passive<
	T extends ClassType<Action>[] = ClassType<Action>[]
> extends Resource<number, IPassiveData<[...T]>> {
	public execute(ctx: IPassiveExecutionContext<[...T]>) {
		return this.data.execute.call(this, ctx)
	}

	public validate(ctx: IPassiveExecutionContext<[...T]>) {
		return this.data.validate?.call(this, ctx) ?? true
	}

	public get appendTag() {
		return this.data.appendTag ?? true
	}

	public isAttacker(ctx: IPassiveExecutionContext) {
		return ctx.entity === ctx.action.entity
	}

	public isDefender(ctx: IPassiveExecutionContext) {
		return !this.isAttacker(ctx)
	}
}
