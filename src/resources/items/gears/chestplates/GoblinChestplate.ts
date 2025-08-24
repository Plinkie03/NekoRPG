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
	id: 20,
	name: 'Goblin Chestplate',
	gearType: GearType.Chestplate,
	emoji: '<:goblin_chest:1409173756173222041>',
	stats: new StatBuilder().maxHealth(110, 0.35).defense(35, 0.35),
	requirements: {
		equip: new RequirementBuilder().skills(
			new SkillRequirementBuilder().add(SkillType.Defense, 10)
		),
		craft: new CraftBuilder()
			.chance(0.75)
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder()
						.add(IronIngot, 15)
						.add(GoblinLeather, 15)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 300)
				)
			),
	},
})
