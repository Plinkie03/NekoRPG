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
	id: 22,
	name: 'Goblin Necklace',
	gearType: GearType.Necklace,
	emoji: '<:goblin_necklace:1409173767262834698>',
	stats: new StatBuilder().criticalRate(0.15).criticalMultiplier(0.35),
	requirements: {
		equip: new RequirementBuilder().skills(
			new SkillRequirementBuilder().add(SkillType.Endurance, 10)
		),
		craft: new CraftBuilder()
			.chance(0.75)
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder()
						.add(IronIngot, 20)
						.add(GoblinLeather, 20)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 400)
				)
			),
	},
})
