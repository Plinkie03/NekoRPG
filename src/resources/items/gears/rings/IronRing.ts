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
	id: 9,
	name: 'Iron Ring',
	description: 'A ring made with the effort of cutting iron',
	gearType: GearType.Ring,
	stats: new StatBuilder()
		.archeryResistance(0.05)
		.meleeResistance(0.05)
		.magicResistance(0.05),
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
	emoji: '<:iron_ring:1402774926208794695>',
})
