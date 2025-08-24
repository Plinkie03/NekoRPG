import { ArgType, Command, InventoryManagementResponse } from '@nekorpg'
import { MessageFlags } from 'discord.js'

export default new Command({
	name: 'inventory',
	description: 'Shows your inventory',
	args: [
		{
			name: 'search',
			description: 'Search for a specified item',
			type: ArgType.InventoryItem,
		},
	],
	async execute(ctx) {
		await ctx.input.reply({
			flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
			...(ctx.args[0]
				? InventoryManagementResponse.item(ctx, ctx.args[0])
				: InventoryManagementResponse.page(ctx)),
		})

		return true
	},
})
