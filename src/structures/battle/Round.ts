import { Action, Battle, Entity, SkipFirstElement } from '@nekorpg'

export type ClassType<T = any> = new (...args: any[]) => T
export type GetClassInstance<T> = T extends new (...args: any[]) => infer P
	? P
	: never

export class Round {
	public readonly logs = new Array<Action>()

	public constructor(
		public readonly battle: Battle,
		public readonly entity: Entity
	) {}

	public add<T extends ClassType<Action>>(
		action: T,
		data: Omit<ConstructorParameters<T>[0], 'round'>
	) {
		const result = new action({ round: this, ...data })
		this.logs.push(result)
		return result as GetClassInstance<T>
	}

	public addFirst<T extends ClassType<Action>>(
		action: T,
		data: Omit<ConstructorParameters<T>[0], 'round'>
	) {
		const result = new action({ round: this, ...data })
		this.logs.unshift(result)
		return result as GetClassInstance<T>
	}

	public advance() {
		for (const action of this.logs) {
			action.execute()
		}
	}

	public toString() {
		return Action.format(this.logs)
	}
}
