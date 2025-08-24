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
	SkillRequirementBuilder,
} from '@nekorpg'
import IronIngot from '../../materials/IronIngot.js'
import GoblinLeather from '../../materials/GoblinLeather.js'

export default new GearItem({
	id: 21,
	name: 'Goblin Shield',
	gearType: GearType.Shield,
	emoji: '<:goblin_shield:1409173763538550875>',
	stats: new StatBuilder().blockRate(0.2).blockReduction(0.3),
	requirements: {
		equip: new RequirementBuilder().skills(
			new SkillRequirementBuilder().add(SkillType.Defense, 10)
		),
		craft: new CraftBuilder()
			.chance(0.75)
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder()
						.add(IronIngot, 14)
						.add(GoblinLeather, 14)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 275)
				)
			),
	},
})
