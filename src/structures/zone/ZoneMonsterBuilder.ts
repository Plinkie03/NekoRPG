import { Formulas, Monster, Util } from '@nekorpg'

export interface IZoneMonsterData {
	chance: number
	monster: Monster
}

export class ZoneMonsterBuilder extends Array<IZoneMonsterData> {
	public add(mob: Monster, ch = 1) {
		this.push({ monster: mob, chance: ch })
		return this
	}

	public random() {
		for (const data of this) {
			if (Util.isChance(data.chance)) {
				return data.monster.clone()
			}
		}

		return null
	}
}
