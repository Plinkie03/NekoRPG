import {
	ArgType,
	CraftResponse,
	Interaction,
	InteractionType,
	InventoryManagementResponse,
} from '@nekorpg'
import { MessageFlags } from 'discord.js'

export default new Interaction({
	id: 12,
	type: InteractionType.Button,
	args: [
		{
			type: ArgType.Item,
			required: true,
		},
	],
	async execute(ctx) {
		await ctx.input.update({
			flags: MessageFlags.IsComponentsV2,
			...InventoryManagementResponse.item(ctx, ctx.args[0]),
		})
		return true
	},
})
