import { Entity, ISpellExecutionContext, SpellCast, SpellItem } from '@nekorpg'

export abstract class EntitySpell<T extends Entity = Entity> {
	public constructor(
		public readonly entity: T,
		public readonly item: SpellItem,
		public readonly level: number
	) {}

	public get ctx(): Omit<ISpellExecutionContext, 'cast'> {
		return {
			battle: this.entity.battle!,
			target: this.entity.battle!.getEnemy(this.entity),
			entity: this.entity,
			round: this.entity.battle?.getLastRound()!,
		}
	}

	public get castable() {
		return (
			!this.entity.stats.modded.hasSpellCooldown(this.item.id) &&
			this.item.validate(this.ctx)
		)
	}

	public execute(cast: SpellCast) {
		if (this.castable && this.item.execute({ ...this.ctx, cast })) {
			this.entity.stats.modded.addSpellCooldown(
				this.item.id,
				this.item.cooldown
			)
			return true
		} else {
			return false
		}
	}
}
