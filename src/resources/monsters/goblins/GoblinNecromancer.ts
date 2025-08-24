import {
	ItemRewardBuilder,
	Monster,
	MonsterSpellBuilder,
	RewardBuilder,
	StatBuilder,
} from '@nekorpg'
import GoblinLeather from '../../items/materials/GoblinLeather.js'
import GoblinNecklace from '../../items/gears/necklaces/GoblinNecklace.js'
import GoblinRing from '../../items/gears/rings/GoblinRing.js'

export default new Monster({
	id: 5,
	name: 'Goblin Necromancer',
	level: 12,
	emoji: '<:goblin_necromancer:1409157914412847215>',
	stats: new StatBuilder()
		.maxHealth(750)
		.magic(125)
		.defense(25)
		.magicResistance(0.25),
	spells: new MonsterSpellBuilder(),
	rewards: new RewardBuilder()
		.xp(700)
		.money(150)
		.gems(30)
		.items(
			new ItemRewardBuilder()
				.add(GoblinNecklace, 1, 0.1)
				.add(GoblinRing, 1, 0.1)
				.add(GoblinLeather, [1, 8], 0.75)
		),
})
