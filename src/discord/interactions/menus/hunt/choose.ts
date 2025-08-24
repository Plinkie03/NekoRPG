import {
	Interaction,
	ArgType,
	BattleOptionType,
	InteractionType,
	BattleResponse,
} from '@nekorpg'
import { MessageFlags } from 'discord.js'

export default new Interaction({
	id: 3,
	type: InteractionType.StringMenu,
	args: [],
	async execute(ctx) {
		return BattleResponse.execute(ctx, {
			type: BattleOptionType.Spell,
			spell: ctx.extras.player.getSpells()[Number(ctx.input.values[0])],
		})
	},
})
