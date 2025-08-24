import { Event } from '@nekorpg'

export default new Event<'interactionCreate'>({
	async execute(interaction) {
		if (interaction.isChatInputCommand() && interaction.inCachedGuild()) {
			await this.manager.commands.handle(interaction)
		}
	},
})
