import { Action, IActionData } from '@nekorpg'

export interface IActionInfoData extends IActionData {
	text: string
}

export class Info extends Action<IActionInfoData> {
	public override beforeExecute(): void {}

	public override toString(): string {
		return this.data.text + super.toString()
	}
}
