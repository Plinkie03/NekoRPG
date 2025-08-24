import {
	IResourceData,
	Resource,
	EntityStats,
	Nullable,
	Battle,
	EntitySpell,
	SpellItem,
	Passive,
} from '@nekorpg'

export interface IEntityData extends IResourceData<number | string> {}

export abstract class Entity<
	T extends IEntityData = IEntityData
> extends Resource<number | string, T> {
	public abstract readonly stats: EntityStats<Entity<T>>

	public health = 0
	public battle: Nullable<Battle> = null
	public transformation: Nullable<SpellItem> = null

	public prepare(battle: Nullable<Battle> = null) {
		this.stats.modded.reset()
		this.battle = battle
		this.health = this.stats.modded.maxHealth
		this.transformation = null
	}

	public isDead() {
		return this.health === 0
	}

	public isTransformation(item: SpellItem) {
		return this.transformation === item
	}

	public override get emoji(): string | null {
		return this.transformation?.emoji ?? super.emoji
	}

	public override get name(): string {
		return this.transformation?.name ?? super.name
	}

	public override get url(): string | null {
		return this.transformation?.emoji
			? Resource.getEmojiUrl(this.transformation.emoji)
			: super.url
	}

	public heal(n: number) {
		this.health += Math.min(this.stats.modded.maxHealth - this.health, n)
	}

	public damage(n: number) {
		this.health -= Math.min(n, this.health)
	}

	public abstract getSpells(): EntitySpell[]
	public abstract getPassives(): Passive[]

	public transform(data: Nullable<SpellItem>) {
		this.stats.modded.removeModifiers()
		this.transformation = data
	}
}
