import {
	Action,
	Battle,
	BattleOptionType,
	Enum,
	Monster,
	NekoDatabase,
	Player,
} from '@nekorpg'
import Slime from '../resources/monsters/Slime.js'
import { createInterface } from 'readline'
import { stdin, stdout } from 'process'

NekoDatabase.$connect().then(async () => {
	const pl = await NekoDatabase.rawPlayer.getByUserId('123')
	const battle = new Battle([pl, Slime.clone()])

	const reader = createInterface(stdin, stdout)
	reader.resume()

	function advance(option?: BattleOptionType) {
		if (option !== undefined) {
			if (battle.getCurrentEntity() instanceof Monster) {
				battle.advance()
			} else {
				battle.advance({
					type: option as Exclude<
						BattleOptionType,
						BattleOptionType.Spell
					>,
				})
			}

			const round = battle.getLastRound()!
			console.log(
				`=======================ROUND ${
					battle.rounds.length
				}=======================\n${round}\n${battle.entities
					.map(
						(x) =>
							`${x}'s HP: ${x.health} / ${x.stats.modded.maxHealth}`
					)
					.join(' | ')}`
			)

			if (!battle.isActive()) {
				reader.close()
				console.log(`${battle.getWinner()!} won the battle`)
				return
			}
		}

		const options = (
			battle.getCurrentEntity() instanceof Player
				? Enum.values(BattleOptionType)
				: [BattleOptionType.Skip]
		)
			.map((x) => `- ${BattleOptionType[x]} (${x})`)
			.join('\n')
		console.log(`Choose option:\n${options}`)
		reader.question('Option chosen: ', (s) => advance(Number(s)))
	}

	advance()
})
