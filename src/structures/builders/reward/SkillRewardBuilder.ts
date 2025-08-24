import { SkillType } from '@nekorpg'

export interface ISkillRewardData {
	type: SkillType
	xp: number
}

export class SkillRewardBuilder extends Array<ISkillRewardData> {
	public add(type: SkillType, xp: number) {
		this.push({ type, xp })
		return this
	}
}
