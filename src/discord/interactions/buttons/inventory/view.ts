import {
	ArgType,
	Interaction,
	InteractionType,
	InventoryManagementResponse,
} from '@nekorpg'
import { ContainerBuilder, MessageFlags, TextDisplayBuilder } from 'discord.js'

export default new Interaction({
	id: 5,
	args: [
		{
			type: ArgType.InventoryItem,
			required: true,
		},
	],
	type: InteractionType.Button,
	async execute(ctx) {
		await ctx.input.update({
			flags: MessageFlags.IsComponentsV2,
			...InventoryManagementResponse.item(ctx, ctx.args[0]),
		})
		return true
	},
})
