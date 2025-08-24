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

export default new Zone({
	id: 1,
	name: 'Slime Field',
	description: 'A vast field filled with slimes for beginners',
	monsters: new ZoneMonsterBuilder().add(Slime, 1),
	gather: [
		new GatherBuilder(SkillType.Mining).add(
			new GatherItemBuilder(IronOre)
				.chance(0.5)
				.amount(1, 10)
				.rewards(
					new RewardBuilder().skills(
						new SkillRewardBuilder().add(SkillType.Mining, 10)
					)
				)
		),
		new GatherBuilder(SkillType.Woodcutting).add(
			new GatherItemBuilder(FirLog)
				.chance(0.5)
				.amount(1, 10)
				.rewards(
					new RewardBuilder().skills(
						new SkillRewardBuilder().add(SkillType.Woodcutting, 10)
					)
				)
		),
	],
})
