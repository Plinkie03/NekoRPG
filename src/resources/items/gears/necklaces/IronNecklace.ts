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
	id: 10,
	name: 'Iron Necklace',
	description: 'A necklace made with the effort of cutting iron',
	gearType: GearType.Necklace,
	stats: new StatBuilder().criticalRate(0.1).criticalMultiplier(0.25),
	requirements: {
		craft: new CraftBuilder()
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder().add(IronIngot, 12)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 75)
				)
			),
	},
	emoji: '<:iron_necklace:1402774932718489611>',
})
