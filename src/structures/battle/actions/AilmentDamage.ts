import {
	Action,
	Formatters,
	Hit,
	IActionData,
	IActionHitData,
	IEffectExecutionContext,
} from '@nekorpg'

export interface IActionAilmentDamageData extends IActionData {
	damage: number
	text: string
}

export class AilmentDamage extends Action<IActionAilmentDamageData> {
	constructor(data: IActionAilmentDamageData) {
		super(data)
		data.damage = Math.floor(data.damage)
	}

	public override beforeExecute(): void {
		this.entity.damage(this.data.damage)
	}

	public override toString(): string {
		return (
			`${this.data.text} (${Formatters.int(this.data.damage)})` +
			super.toString()
		)
	}
}
