import { SpellItem } from '@nekorpg'

export interface IMonsterSpellData {
	spell: SpellItem
	level: number
}

export class MonsterSpellBuilder extends Array<IMonsterSpellData> {
	public add(spell: SpellItem, level = 1) {
		this.push({ spell, level })
		return this
	}
}
