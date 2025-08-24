import {
	ItemRewardBuilder,
	Monster,
	MonsterSpellBuilder,
	RewardBuilder,
	StatBuilder,
} from '@nekorpg'
import GoblinLeather from '../../items/materials/GoblinLeather.js'
import GoblinShield from '../../items/gears/shields/GoblinShield.js'

export default new Monster({
	id: 3,
	name: 'Goblin Knight',
	level: 7,
	emoji: '<:goblin_knight:1409158484259373066>',
	stats: new StatBuilder()
		.maxHealth(750)
		.melee(75)
		.defense(40)
		.meleeResistance(0.25),
	spells: new MonsterSpellBuilder(),
	rewards: new RewardBuilder()
		.xp(450)
		.money(75)
		.gems(15)
		.items(
			new ItemRewardBuilder()
				.add(GoblinShield, 1, 0.1)
				.add(GoblinLeather, [1, 5], 0.5)
		),
})
