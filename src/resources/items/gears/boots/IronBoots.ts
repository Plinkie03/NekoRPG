import {
	GearItem,
	GearType,
	StatBuilder,
	CraftBuilder,
	RequirementBuilder,
	ItemRequirementBuilder,
	RewardBuilder,
	SkillRewardBuilder,
	SkillType,
} from '@nekorpg'
import IronIngot from '../../materials/IronIngot.js'

export default new GearItem({
	id: 7,
	name: 'Iron Boots',
	gearType: GearType.Boots,
	stats: new StatBuilder()
		.maxHealth(30)
		.defense(30)
		.crowdControlResistance(0.1),
	requirements: {
		craft: new CraftBuilder()
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder().add(IronIngot, 5)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 25)
				)
			),
	},
	emoji: '<:iron_boots:1402774910941794394>',
})
