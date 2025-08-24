import {
	ArgType,
	Interaction,
	InteractionType,
	InventoryManagementResponse,
} from '@nekorpg'
import { MessageFlags } from 'discord.js'

export default new Interaction({
	id: 4,
	type: InteractionType.Button,
	args: [
		{
			type: ArgType.Integer,
			required: true,
		},
	],
	async execute(ctx) {
		await ctx.input.update({
			flags: MessageFlags.IsComponentsV2,
			...InventoryManagementResponse.page(ctx, ctx.args[0]),
		})
		return true
	},
})
