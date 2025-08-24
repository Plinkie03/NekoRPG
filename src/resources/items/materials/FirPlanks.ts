import {
	CraftBuilder,
	ItemRequirementBuilder,
	MaterialItem,
	RequirementBuilder,
	RewardBuilder,
	SkillRewardBuilder,
	SkillType,
} from '@nekorpg'
import FirLog from './FirLog.js'

export default new MaterialItem({
	id: 13,
	name: 'Fir Planks',
	price: 200,
	description: 'Some fir log you chopped off trees',
	emoji: '<:iron_chunk:1402773291818684457>',
	requirements: {
		craft: new CraftBuilder()
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder().add(FirLog, 5)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 10)
				)
			),
	},
})
