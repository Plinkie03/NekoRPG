import { ArgType, Command, InventoryManagementResponse, Logger } from '@nekorpg'
import { MessageFlags } from 'discord.js'

export default new Command({
	name: 'item',
	description: 'Search for an item',
	args: [
		{
			name: 'query',
			description: 'The item to search for',
			type: ArgType.Item,
			required: true,
		},
	],
	async execute(ctx) {
		await ctx.input.reply({
			flags: MessageFlags.IsComponentsV2,
			...InventoryManagementResponse.item(ctx, ctx.args[0]),
		})

		return true
	},
})
