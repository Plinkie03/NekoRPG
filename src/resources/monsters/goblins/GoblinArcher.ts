import {
	ItemRewardBuilder,
	Monster,
	MonsterSpellBuilder,
	RewardBuilder,
	StatBuilder,
} from '@nekorpg'
import GoblinLeather from '../../items/materials/GoblinLeather.js'
import GoblinBoots from '../../items/gears/boots/GoblinBoots.js'

export default new Monster({
	id: 4,
	name: 'Goblin Archer',
	level: 9,
	emoji: '<:goblin_ranger:1409157909098664116>',
	stats: new StatBuilder()
		.maxHealth(600)
		.archery(100)
		.defense(25)
		.archeryResistance(0.25),
	spells: new MonsterSpellBuilder(),
	rewards: new RewardBuilder()
		.xp(500)
		.money(100)
		.gems(20)
		.items(
			new ItemRewardBuilder()
				.add(GoblinBoots, 1, 0.1)
				.add(GoblinLeather, [1, 5], 0.65)
		),
})
