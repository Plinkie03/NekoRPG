import { Command, InventoryManagementResponse } from '@nekorpg'
import { MessageFlags } from 'discord.js'

export default new Command({
	name: 'inventory',
	description: 'Shows your inventory',
	async execute(ctx) {
		await ctx.input.reply({
			flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
			...InventoryManagementResponse.page(ctx),
		})
		return true
	},
})
