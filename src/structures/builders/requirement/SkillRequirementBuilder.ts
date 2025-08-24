import { SkillType } from '@nekorpg'

export interface ISkillRequirementData {
	type: SkillType
	level: number
}

export class SkillRequirementBuilder extends Array<ISkillRequirementData> {
	public add(type: SkillType, level: number) {
		this.push({ type, level })
		return this
	}
}
