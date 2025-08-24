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
	id: 8,
	name: 'Iron Shield',
	description: 'A shield made with the effort of melting iron',
	gearType: GearType.Shield,
	stats: new StatBuilder().blockRate(0.1).blockReduction(0.1),
	requirements: {
		craft: new CraftBuilder()
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder().add(IronIngot, 10)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 50)
				)
			),
	},
	emoji: '<:iron_shield:1402774920823308393>',
})
