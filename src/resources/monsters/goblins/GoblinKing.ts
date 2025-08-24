import {
	ItemRewardBuilder,
	Monster,
	MonsterSpellBuilder,
	RewardBuilder,
	StatBuilder,
} from '@nekorpg'
import GoblinLeather from '../../items/materials/GoblinLeather.js'
import GoblinCrown from '../../items/gears/helmets/GoblinCrown.js'

export default new Monster({
	id: 6,
	name: 'Goblin King',
	level: 15,
	emoji: '<:goblin_king:1409157902500892692>',
	stats: new StatBuilder()
		.maxHealth(2500)
		.melee(200)
		.defense(100)
		.damageResistance(0.25),
	spells: new MonsterSpellBuilder(),
	rewards: new RewardBuilder()
		.xp(3000)
		.money(1000)
		.gems(100)
		.items(
			new ItemRewardBuilder()
				.add(GoblinCrown, 0.1)
				.add(GoblinLeather, [1, 15], 1)
		),
})
