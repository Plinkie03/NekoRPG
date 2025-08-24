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
	id: 18,
	name: 'Goblin Crown',
	gearType: GearType.Helmet,
	emoji: '<:goblin_crown:1409173864214171739>',
	stats: new StatBuilder()
		.maxHealth(300)
		.defense(100)
		.blockRate(0.1)
		.criticalRate(0.1)
		.criticalMultiplier(0.25)
		.lifesteal(0.1)
		.damageResistance(0.2),
	requirements: {
		equip: new RequirementBuilder().skills(
			new SkillRequirementBuilder()
				.add(SkillType.Defense, 15)
				.add(SkillType.Endurance, 15)
		),
	},
})
