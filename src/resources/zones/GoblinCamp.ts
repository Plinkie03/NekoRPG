import {
	GatherBuilder,
	GatherItemBuilder,
	RewardBuilder,
	SkillRewardBuilder,
	SkillType,
	Zone,
	ZoneMonsterBuilder,
} from '@nekorpg'
import Slime from '../monsters/Slime.js'
import IronOre from '../items/materials/IronOre.js'
import FirLog from '../items/materials/FirLog.js'
import GoblinBandit from '../monsters/goblins/GoblinBandit.js'
import GoblinArcher from '../monsters/goblins/GoblinArcher.js'
import GoblinNecromancer from '../monsters/goblins/GoblinNecromancer.js'
import GoblinKing from '../monsters/goblins/GoblinKing.js'
import GoblinKnight from '../monsters/goblins/GoblinKnight.js'

export default new Zone({
	id: 2,
	name: 'Goblin Camp',
	description: 'A camp with bandits so called goblins',
	monsters: new ZoneMonsterBuilder()
		.add(GoblinKing, 0.1)
		.add(GoblinArcher, 0.25)
		.add(GoblinNecromancer, 0.25)
		.add(GoblinKnight, 0.25)
		.add(GoblinBandit, 1),
	gather: [],
})
