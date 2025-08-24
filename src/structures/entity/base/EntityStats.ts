import { Entity, EntityBaseStats, EntityModdedStats, Stats } from '@nekorpg'

export abstract class EntityStats<T extends Entity = Entity> {
	public abstract readonly base: EntityBaseStats<T>
	public abstract readonly modded: EntityModdedStats<T>

	public constructor(public readonly entity: T) {}

	public abstract get offensiveStat(): 'magic' | 'melee' | 'archery'
}
