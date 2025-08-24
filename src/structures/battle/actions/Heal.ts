import { Action, Formatters, IActionData } from '@nekorpg'
import { bold } from 'discord.js'

export interface IActionHealData extends IActionData {
	amount: number
	full?: boolean
}

export class Heal extends Action<IActionHealData> {
	public constructor(data: IActionHealData) {
		super(data)
		data.amount = Math.floor(data.amount)
	}

	public override beforeExecute(): void {
		this.entity.heal(
			this.data.full
				? this.entity.stats.modded.maxHealth
				: this.data.amount
		)
	}

	public override toString(): string {
		return (
			`${this.entity} has healed for ${bold(
				Formatters.int(
					this.data.full
						? this.entity.stats.modded.maxHealth
						: this.data.amount
				)
			)} HP!` + super.toString()
		)
	}
}
