import { Event } from '@nekorpg'

export default new Event<'interactionCreate'>({
	async execute(interaction) {
		if (interaction.isMessageComponent() && interaction.inCachedGuild()) {
			await this.manager.interactions.handle(interaction)
		}
	},
})
