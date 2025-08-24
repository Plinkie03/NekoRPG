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
	id: 6,
	name: 'Iron Helmet',
	gearType: GearType.Helmet,
	stats: new StatBuilder().maxHealth(30).defense(5).damageResistance(0.1),
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
	emoji: '<:iron_helmet:1402774911835181148>',
})
