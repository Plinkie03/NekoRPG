import { Event, FileScheme, NekoClient, NekoManager } from '@nekorpg'
import { ClientEvents, Collection } from 'discord.js'
import { readdirSync } from 'fs'
import { join, resolve } from 'path'

export class NekoEvents {
	private static readonly _Path = join('dist', 'events')

	private readonly _events = new Collection<string, Event[]>()

	public constructor(public readonly manager: NekoManager) {}

	public async load() {
		for (const folder of readdirSync(NekoEvents._Path, {
			withFileTypes: true,
		})) {
			for (const file of readdirSync(
				resolve(folder.parentPath, folder.name),
				{ withFileTypes: true }
			)) {
				const imported = await import(
					FileScheme + resolve(file.parentPath, file.name)
				).then((x) => x.default as Event)
				this._events
					.ensure(folder.name as keyof ClientEvents, () => [])
					.push(imported)
			}

			this.manager.client.on(
				folder.name as keyof ClientEvents,
				this._eventRunner.bind(this, folder.name as keyof ClientEvents)
			)
		}
	}

	private _eventRunner<T extends keyof ClientEvents>(
		listener: T,
		...args: any[]
	) {
		const commands = this._events.get(listener)!

		for (const command of commands.values()) {
			command.data.execute.call(this.manager.client, ...(args as never))
		}
	}
}
