import {
	NekoClient,
	NekoCommands,
	NekoEvents,
	NekoInteractions,
} from '@nekorpg'

export class NekoManager {
	public readonly events = new NekoEvents(this)
	public readonly commands = new NekoCommands(this)
	public readonly interactions = new NekoInteractions(this)

	public constructor(public readonly client: NekoClient) {}
}
