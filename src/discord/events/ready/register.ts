import { Event, Logger } from '@nekorpg'

export default new Event<'ready'>({
	async execute(client) {
		await this.application.commands.set(this.manager.commands.toJSON())
		Logger.success(`Registered application commands!`)
	},
})
