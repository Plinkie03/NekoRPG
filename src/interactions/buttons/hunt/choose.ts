import {
	ArgType,
	BattleOptionType,
	Interaction,
	InteractionType,
	Player,
	BattleResponse,
} from '@nekorpg'
import { MessageFlags } from 'discord.js'

export default new Interaction({
	id: 2,
	type: InteractionType.Button,
	args: [
		{
			type: ArgType.Enum,
			enum: BattleOptionType,
			required: true,
		},
	],
	async execute(ctx) {
		return BattleResponse.execute(ctx, { type: ctx.args[0] as any })
	},
})
