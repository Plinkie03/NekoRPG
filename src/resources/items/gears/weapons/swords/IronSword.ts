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
} from '@nekorpg'
import IronIngot from '../../../materials/IronIngot.js'

export default new GearItem({
	id: 2,
	gearType: GearType.Weapon,
	name: 'Iron Sword',
	description: 'A sword made of pure iron',
	stats: new StatBuilder().melee(10, 0.1),
	weaponType: WeaponType.Sword,
	requirements: {
		craft: new CraftBuilder()
			.requirements(
				new RequirementBuilder().items(
					new ItemRequirementBuilder().add(IronIngot, 4)
				)
			)
			.rewards(
				new RewardBuilder().skills(
					new SkillRewardBuilder().add(SkillType.Smithing, 40)
				)
			),
	},
	emoji: '<:iron_sword:1402770412500291634>',
})
