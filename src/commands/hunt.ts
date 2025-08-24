import { Battle, Command, BattleResponse } from '@nekorpg'
import { MessageFlags } from 'discord.js'

export default new Command({
	name: 'hunt',
	description: 'Attempt to find a mob in this zone',
	async execute(ctx) {
		const mob = ctx.extras.player.zone.data.monsters?.random()
		if (!mob) {
			await ctx.input.reply({
				flags: MessageFlags.Ephemeral,
				content: 'There is no mob around :(',
			})
			return false
		}

		const battle = new Battle([ctx.extras.player, mob])

		await ctx.input.reply({
			flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
			components: [BattleResponse.create(battle)],
		})

		return true
	},
})
