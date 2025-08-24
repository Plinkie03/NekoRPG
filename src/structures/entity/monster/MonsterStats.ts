import {
	EntityStats,
	Monster,
	MonsterBaseStats,
	MonsterModdedStats,
	Stats,
} from '@nekorpg'

export class MonsterStats extends EntityStats<Monster> {
	public readonly base = new MonsterBaseStats(this.entity)
	public readonly modded = new MonsterModdedStats(this.entity)

	public get offensiveStat() {
		return this.base.melee ? 'melee' : this.base.magic ? 'magic' : 'archery'
	}
}
