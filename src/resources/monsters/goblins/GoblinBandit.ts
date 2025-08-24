import {
	ItemRewardBuilder,
	Monster,
	MonsterSpellBuilder,
	RewardBuilder,
	StatBuilder,
} from '@nekorpg'
import GoblinLeather from '../../items/materials/GoblinLeather.js'
import GoblinHelmet from '../../items/gears/helmets/GoblinHelmet.js'

export default new Monster({
	id: 2,
	name: 'Goblin Bandit',
	level: 5,
	emoji: '<:goblin_bandit:1409158062656192553>',
	stats: new StatBuilder().maxHealth(500).melee(50).defense(25),
	spells: new MonsterSpellBuilder(),
	rewards: new RewardBuilder()
		.xp(300)
		.money(50)
		.gems(10)
		.items(
			new ItemRewardBuilder()
				.add(GoblinHelmet, 1, 0.1)
				.add(GoblinLeather, [1, 3], 0.25)
		),
})
