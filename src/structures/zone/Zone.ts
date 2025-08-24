import {
	GatherBuilder,
	IResourceData,
	Monster,
	RequirementBuilder,
	Resource,
	SkillType,
	ZoneMonsterBuilder,
} from '@nekorpg'

export interface IZoneData extends IResourceData<number> {
	requirements?: RequirementBuilder
	gather?: GatherBuilder[]
	monsters?: ZoneMonsterBuilder
}

export class Zone extends Resource<number, IZoneData> {}
