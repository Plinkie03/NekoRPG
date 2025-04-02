import { join, resolve } from "path";
import { NekoClient } from "./NekoClient.js";
import { readdirSync } from "fs";
import { ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, Collection } from "discord.js";
import { Command } from "../structures/discord/Command.js";
import { Importer } from "../structures/util/Importer.js";

export class NekoCommands {
    private static readonly _Path = resolve("dist", "commands")

    private readonly _commands = new Collection<string, Command | Collection<string, Command>>()

    public constructor(private readonly _client: NekoClient) {}

    public get(i: ChatInputCommandInteraction<'cached'> | AutocompleteInteraction<'cached'>) {
        const command = this._commands.get(i.commandName)
        
        if (command instanceof Command)
            return command

        return command?.get(i.options.getSubcommand(true)) ?? null
    }

    public async load() {
        for (const file1 of readdirSync(NekoCommands._Path, { withFileTypes: true })) {
            if (file1.isDirectory()) {
                const commands = new Collection<string, Command>()

                for (const file2 of readdirSync(join(file1.path, file1.name), { withFileTypes: true })) {
                    const command = await Importer.import<Command>(join(file2.path, file2.name))
                    commands.set(command.data.name, command)
                }

                this._commands.set(file1.name, commands)
            } else {
                const command = await Importer.import<Command>(join(file1.path, file1.name))
                this._commands.set(command.data.name, command)
            }
        }
    }

    public toJSON(): ApplicationCommandData[] {
        const commands = new Array<ApplicationCommandData>()

        for (const [ commandName, command ] of this._commands) {
            if (command instanceof Command) {
                commands.push(command.toJSON())
            } else {
                const json: ApplicationCommandData = {
                    name: commandName,
                    description: `Command list for ${commandName} (${commands.length})`,
                    options: <never>command.map(x => x.toJSON()).map(x => {
                        Reflect.set(x, "type", ApplicationCommandOptionType.Subcommand)
                        return x
                    })
                }

                commands.push(json)
            }
        }

        return commands
    }
}