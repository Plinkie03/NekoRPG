import {
	ItemRewardBuilder,
	Monster,
	MonsterSpellBuilder,
	RewardBuilder,
	StatBuilder,
} from '@nekorpg'
import SlimeOrb from '../items/materials/SlimeOrb.js'
import IronIngot from '../items/materials/IronIngot.js'

export default new Monster({
	id: 1,
	name: 'Slime',
	level: 1,
	emoji: '<:slime:1406648336672493608>',
	stats: new StatBuilder().maxHealth(100).melee(10).defense(0),
	spells: new MonsterSpellBuilder(),
	rewards: new RewardBuilder()
		.xp(100)
		.money(5)
		.gems(1)
		.items(
			new ItemRewardBuilder()
				.add(IronIngot, [1, 2], 0.1)
				.add(SlimeOrb, [1, 5], 1)
		),
})
