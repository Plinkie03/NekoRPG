import { Command, GatherResponse } from '@nekorpg'
import { MessageFlags } from 'discord.js'

export default new Command({
	name: 'gather',
	description: 'Use gathering spots in your zone',
	async execute(ctx) {
		await ctx.input.reply({
			flags: MessageFlags.Ephemeral,
			...GatherResponse.display(ctx),
		})
		return true
	},
})
