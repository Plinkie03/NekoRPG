import { Event } from '@nekorpg'

export default new Event<'ready'>({
	execute(client) {
		console.log(`Ready on client ${this.user.displayName}!`)
	},
})
