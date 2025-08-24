import {
	EntityStats,
	Player,
	PlayerBaseStats,
	PlayerModdedStats,
	WeaponType,
	Stats,
} from '@nekorpg'

export class PlayerStats extends EntityStats<Player> {
	public readonly base = new PlayerBaseStats(this.entity)
	public readonly modded = new PlayerModdedStats(this.entity)

	public get offensiveStat() {
		switch (this.entity.gear.weapon?.item.weaponType) {
			case WeaponType.Bow:
				return 'archery'
			case WeaponType.Wand:
				return 'magic'
			default:
				return 'melee'
		}
	}
}
