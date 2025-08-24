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
	id: 17,
	name: 'Goblin Helmet',
	gearType: GearType.Helmet,
	emoji: '<:goblin_helmet:1409173744685023252>',
	stats: new StatBuilder().maxHealth(150).defense(25).damageResistance(0.15),
	requirements: {
		equip: new RequirementBuilder().skills(
			new SkillRequirementBuilder().add(SkillType.Defense, 10)
		),
		craft: new CraftBuilder()
			.chance(0.75)
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder()
						.add(IronIngot, 10)
						.add(GoblinLeather, 10)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 200)
				)
			),
	},
})
