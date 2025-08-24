import {
	Action,
	Formatters,
	IActionData,
	ITemporaryStatModifier,
	Stats,
} from '@nekorpg'
import { bold } from 'discord.js'

export interface IActionFortificationData
	extends IActionData,
		ITemporaryStatModifier {}

export class Fortification extends Action<IActionFortificationData> {
	public override beforeExecute(): void {
		this.entity.stats.modded.addModifier(this.data)
	}

	public override toString(): string {
		return (
			`${this.entity}'s ${bold(
				Formatters.camelToTitle(this.data.stat)
			)} has ${
				(this.data.modifier.absolute &&
					this.data.modifier.absolute < 0) ||
				(this.data.modifier.multiplier &&
					this.data.modifier.multiplier < 0)
					? 'decreased'
					: 'increased'
			} by ${bold(
				this.data.modifier.absolute
					? Formatters.int(Math.abs(this.data.modifier.absolute))
					: Formatters.percentual(
							Math.abs(this.data.modifier.multiplier!)
					  )
			)}${
				this.data.duration === -1
					? ''
					: ` for ${bold(this.data.duration.toString())} rounds!`
			}` + super.toString()
		)
	}
}
