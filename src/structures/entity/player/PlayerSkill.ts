import {
	ILeveable,
	Player,
	Leveable,
	Info,
	Formatters,
	Formulas,
} from '@nekorpg'
import { RawSkill } from '../../../../prisma/generated/index.js'

export enum SkillType {
	Endurance,
	Defense,
	Archery,
	Melee,
	Magic,
	Mining,
	Woodcutting,
	Smithing,
	Wisdom,
}

export class PlayerSkill implements ILeveable {
	public constructor(
		public readonly player: Player,
		public readonly data: RawSkill
	) {}

	public set xp(value: number) {
		this.data.xp = value
	}

	public set level(value: number) {
		this.data.level = value
	}

	public get xp() {
		return this.data.xp
	}

	public get level() {
		return this.data.level
	}

	public get type() {
		return this.data.type as SkillType
	}

	public get multiplier() {
		return Math.sqrt(this.level)
	}

	public getXpReq() {
		return Formulas.xpReq(this.level, 5)
	}

	public addXp(xp: number): boolean {
		const result = Leveable.addXp(this, xp)

		if (result) {
			this.player.battle?.getLastRound()?.add(Info, {
				entity: this.player,
				text: `${this.player}'s ${
					SkillType[this.type]
				} is now level ${Formatters.int(this.level)}!`,
			})
		}

		return result
	}
}
