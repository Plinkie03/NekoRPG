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
	id: 23,
	name: 'Goblin Ring',
	gearType: GearType.Ring,
	emoji: '<:goblin_ring:1409173777069375628>',
	stats: new StatBuilder()
		.archeryResistance(0.1)
		.meleeResistance(0.1)
		.magicResistance(0.1),
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
