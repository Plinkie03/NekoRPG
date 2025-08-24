import {
	Command,
	DiscordContext,
	FileScheme,
	Interaction,
	NekoManager,
} from '@nekorpg'
import { Collection, MessageComponentInteraction } from 'discord.js'
import { readdirSync } from 'fs'
import { join, resolve } from 'path'

export class NekoInteractions {
	private static readonly _Path = join('dist', 'interactions')

	private readonly _interactions = new Collection<number, Interaction>()

	public constructor(public readonly manager: NekoManager) {}

	public async load() {
		for (const file of readdirSync(NekoInteractions._Path, {
			withFileTypes: true,
			recursive: true,
		}).filter((x) => x.isFile())) {
			const imported = await import(
				FileScheme + resolve(file.parentPath, file.name)
			).then((x) => x.default as Interaction)

			if (this._interactions.has(imported.data.id)) {
				throw new Error(
					`Interactio id ${imported.data.id} already exists!`
				)
			}

			this._interactions.set(imported.data.id, imported)
		}
	}

	public async handle(i: MessageComponentInteraction<'cached'>) {
		const [id, ...raw] = i.customId.split(Interaction['_Splits'])
		const int = this._interactions.get(Number(id))
		if (!int) return

		const extras = await Command.getExtras(i)
		const args = await int.parseArgs(i, raw, extras)
		if (args === null) return

		await int.data.execute.call(
			this.manager.client,
			new DiscordContext({
				input: i,
				args,
				extras,
			} as any)
		)
	}
}
