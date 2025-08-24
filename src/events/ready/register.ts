import { Event } from '@nekorpg'

export default new Event<'ready'>({
	async execute(client) {
		await this.application.commands.set(this.manager.commands.toJSON())
		console.log(`Registered application commands!`)
	},
})
