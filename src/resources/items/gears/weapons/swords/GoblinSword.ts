import {
	GearItem,
	GearType,
	StatBuilder,
	WeaponType,
	CraftBuilder,
	RequirementBuilder,
	ItemRequirementBuilder,
	RewardBuilder,
	SkillRewardBuilder,
	SkillType,
	SkillRequirementBuilder,
} from '@nekorpg'
import IronIngot from '../../../materials/IronIngot.js'
import GoblinLeather from '../../../materials/GoblinLeather.js'
import FirLog from '../../../materials/FirLog.js'

export default new GearItem({
	id: 16,
	gearType: GearType.Weapon,
	name: 'Goblin Sword',
	emoji: '<:goblin_sword:1409161623087743006>',
	description: 'A sword made of goblin leather and some iron',
	stats: new StatBuilder().melee(40, 0.2),
	weaponType: WeaponType.Sword,
	requirements: {
		equip: new RequirementBuilder().skills(
			new SkillRequirementBuilder().add(SkillType.Melee, 10)
		),
		craft: new CraftBuilder()
			.chance(0.75)
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder()
						.add(IronIngot, 5)
						.add(FirLog, 5)
						.add(GoblinLeather, 10)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 150)
				)
			),
	},
})
