import { Event } from '@nekorpg'

export default new Event<'interactionCreate'>({
	async execute(interaction) {
		if (interaction.isAutocomplete() && interaction.inCachedGuild()) {
			await this.manager.commands.autocomplete(interaction)
		}
	},
})
