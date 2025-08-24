import { Action, EntitySpell, IActionData } from '@nekorpg'
import { bold } from 'discord.js'

export interface IActionSpellData extends IActionData {
	spell: EntitySpell
}

export class SpellCast extends Action<IActionSpellData> {
	public override beforeExecute(): void {}

	public get spell() {
		return this.data.spell
	}

	public override toString(): string {
		return (
			`${this.entity} casted spell ${bold(this.spell.item.toString())}${
				this.spell.item.data.requiresTarget
					? ` on ${this.spell.ctx.target}`
					: ''
			}` + super.toString()
		)
	}
}
