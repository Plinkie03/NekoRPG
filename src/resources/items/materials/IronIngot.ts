import {
	MaterialItem,
	CraftBuilder,
	RequirementBuilder,
	ItemRequirementBuilder,
	RewardBuilder,
	SkillRewardBuilder,
	SkillType,
} from '@nekorpg'
import IronOre from './IronOre.js'

export default new MaterialItem({
	id: 5,
	name: 'Iron Ingot',
	price: 200,
	description: 'A good melted iron, might be worth something',
	emoji: '<:iron_ingot:1402773388119769090>',
	requirements: {
		craft: new CraftBuilder()
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder().add(IronOre, 5)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 10)
				)
			),
	},
})
