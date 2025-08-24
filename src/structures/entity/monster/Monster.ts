import {
	IResourceData,
	StatBuilder,
	Entity,
	MonsterStats,
	RewardBuilder,
	EntitySpell,
	MonsterSpellBuilder,
	MonsterSpell,
	Passive,
} from '@nekorpg'

export interface IMonsterData extends IResourceData<number> {
	stats: StatBuilder
	rewards: RewardBuilder
	level: number
	passives?: Passive[]
	spells?: MonsterSpellBuilder
}

export class Monster extends Entity<IMonsterData> {
	public readonly stats = new MonsterStats(this)

	public get id(): number {
		return this.data.id
	}

	public clone() {
		return new Monster(this.data)
	}

	public override getPassives(): Passive[] {
		return this.data.passives ?? []
	}

	public override getSpells(): MonsterSpell[] {
		return (
			this.data.spells?.map(
				(x) => new MonsterSpell(this, x.spell, x.level)
			) ?? []
		)
	}
}
