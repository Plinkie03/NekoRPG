import {
	Command,
	DiscordContext,
	FileScheme,
	NekoClient,
	NekoManager,
} from '@nekorpg'
import {
	ApplicationCommandData,
	ApplicationCommandOptionType,
	ApplicationCommandSubCommandData,
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	Collection,
} from 'discord.js'
import { readdirSync } from 'fs'
import { join, resolve } from 'path'

export class NekoCommands {
	private static readonly _Path = join('dist', 'discord', 'commands')

	private readonly _commands = new Collection<
		string,
		Command | Collection<string, Command>
	>()

	public constructor(public readonly manager: NekoManager) {}

	public async load() {
		for (const file1 of readdirSync(NekoCommands._Path, {
			withFileTypes: true,
		})) {
			if (file1.isDirectory()) {
				const commands = new Collection<string, Command>()

				for (const file2 of readdirSync(
					join(file1.parentPath, file1.name),
					{ withFileTypes: true }
				)) {
					const imported = await import(
						FileScheme + resolve(file2.parentPath, file2.name)
					).then((x) => x.default as Command)
					commands.set(imported.data.name, imported)
				}

				this._commands.set(file1.name, commands)
			} else {
				const imported = await import(
					FileScheme + resolve(file1.parentPath, file1.name)
				).then((x) => x.default as Command)
				this._commands.set(imported.data.name, imported)
			}
		}
	}

	public toJSON() {
		const arr = new Array<ApplicationCommandData>()

		for (const [key, command] of this._commands) {
			if (command instanceof Command) {
				arr.push(command.toJSON())
			} else {
				const data = {
					name: key,
					description: 'Commands for ' + key,
					options: [] as any,
				}

				for (const [, subcommand] of command) {
					data.options.push({
						...subcommand.toJSON(),
						type: ApplicationCommandOptionType.Subcommand,
					})
				}

				arr.push(data)
			}
		}

		return arr
	}

	public getCommand(
		i:
			| AutocompleteInteraction<'cached'>
			| ChatInputCommandInteraction<'cached'>
	) {
		const group = this._commands.get(i.commandName)
		if (group instanceof Collection) {
			return group.get(i.options.getSubcommand(true))
		} else {
			return group
		}
	}

	public async autocomplete(i: AutocompleteInteraction<'cached'>) {
		const command = this.getCommand(i)
		if (!command) return

		const focus = i.options.getFocused(true)
		const arg = command.data.args?.find((x) => x.name === focus.name)
		if (!arg) return

		await i.respond(
			arg.autocomplete?.call(i.client as NekoClient, i, focus.value) ?? []
		)
	}

	public async handle(i: ChatInputCommandInteraction<'cached'>) {
		const command = this.getCommand(i)
		if (!command) return

		const extras = await Command.getExtras(i)
		const args = await command.parseArgs(i, extras)
		if (args === null) return

		await command.data.execute.call(
			this.manager.client,
			new DiscordContext({
				input: i,
				args,
				extras,
			})
		)
	}
}
