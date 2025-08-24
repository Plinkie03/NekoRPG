import { Action, Effect, IActionData } from '@nekorpg'

export interface IActionAilmentData extends IActionData {
	effect: Effect
	duration: number
}

export class Ailment extends Action<IActionAilmentData> {
	public override beforeExecute(): void {
		this.entity.stats.modded.addAilment(
			this.data.effect,
			this.data.duration
		)
	}

	public override toString(): string {
		return (
			`${this.entity} was inflicted ${this.data.effect}${
				this.data.duration === -1
					? ''
					: ` for ${this.data.duration} rounds!`
			}` + super.toString()
		)
	}
}
