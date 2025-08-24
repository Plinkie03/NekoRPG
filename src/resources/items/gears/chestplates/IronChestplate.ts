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
	id: 3,
	name: 'Iron Chestplate',
	description: 'A chestplate to cover you in iron',
	gearType: GearType.Chestplate,
	stats: new StatBuilder().maxHealth(30, 0.2).defense(15, 0.2),
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
	emoji: '<:iron_armor:1402771225037508678>',
})
