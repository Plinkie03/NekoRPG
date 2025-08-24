import { Event, Logger } from '@nekorpg'

export default new Event<'ready'>({
	execute(client) {
		Logger.success(`Ready on client ${this.user.displayName}!`)
	},
})
