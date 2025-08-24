import {
	BaseItem,
	Battle,
	Entity,
	IBaseItemData,
	NekoClient,
	Round,
	SpellCast,
} from '@nekorpg'

export interface ISpellValidationContext {
	battle: Battle
	entity: Entity
	target: Entity
}

export interface ISpellExecutionContext extends ISpellValidationContext {
	round: Round
	cast: SpellCast
}

export interface ISpellItemData<Data> extends IBaseItemData {
	maxLevel?: number
	cooldown: number
	extras?: Data
	requiresTarget?: boolean
	validate?: (this: SpellItem<Data>, ctx: ISpellValidationContext) => boolean
	execute: (this: SpellItem<Data>, ctx: ISpellExecutionContext) => boolean
}

export class SpellItem<Data = any> extends BaseItem<ISpellItemData<Data>> {
	public execute(ctx: ISpellExecutionContext) {
		return this.data.execute.call(this, ctx)
	}

	public validate(ctx: ISpellValidationContext) {
		return this.data.validate?.call(this, ctx) ?? true
	}

	/**
	 * Only useful for transformations
	 * @returns
	 */
	public createId(number = 1) {
		return `${this.id}_${number}`
	}

	public get cooldown() {
		return this.data.cooldown
	}

	public get maxLevel() {
		return this.data.maxLevel ?? 1
	}
}
