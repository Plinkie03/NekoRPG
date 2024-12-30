import { ApplicationCommand, ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, ClientEvents, Collection, RepliableInteraction, User } from "discord.js";
import { NekoClient } from "./NekoClient.js";
import { Command } from "../structures/discord/Command.js";
import { readdirSync } from "fs";
import { resolve } from "path";
import { cwd } from "process";
import { FileScheme } from "../Constants.js";
import { DiscordEventHandler } from "../structures/discord/DiscordEventHandler.js";
import { DiscordInteractionHandler } from "../structures/discord/DiscordInteractionHandler.js";

export class NekoManager {
    public readonly commands = new Collection<string, Command | Collection<string, Command>>()
    public readonly interactions = new Collection<number, DiscordInteractionHandler>()

    public readonly locked = new Set<string>()

    public constructor(private readonly client: NekoClient) {}

    public getJSONCommands() {
        const raw = new Array<ApplicationCommandData>()

        for (const [ commandName, command ] of this.commands.entries()) {
            if (command instanceof Command) {
                raw.push(command.toJSON())
            } else {
                raw.push({
                    name: commandName,
                    description: commandName,
                    options: <never[]>command.map(x => ({
                        ...x.toJSON(),
                        type: ApplicationCommandOptionType.Subcommand
                    }))
                })
            }
        }

        return raw
    }

    public async loadEvents() {
        for (const eventName of readdirSync(resolve("dist", "events")) as Array<keyof ClientEvents>) {
            for (const eventHandler of readdirSync(resolve("dist", "events", eventName), { withFileTypes: true })) {
                const req: DiscordEventHandler = await import(FileScheme + resolve(eventHandler.path, eventHandler.name)).then(x => x.default)
                this.client[req.once ? "once" : "on"](req.name, req.listener)
            }
        }
    }

    public async loadInteractions() {
        for (const file of readdirSync(resolve("dist", "interactions"), { withFileTypes: true, recursive: true })) {
            if (file.isDirectory()) continue

            const req: DiscordInteractionHandler = await import(FileScheme + resolve(file.path, file.name)).then(x => x.default)

            if (this.interactions.has(req["data"].id)) {
                throw new Error(`${req["data"].id} already exists as an interaction!`)
            }

            this.interactions.set(req["data"].id, req)
        }
    }

    public async loadCommands() {
        for (const file of readdirSync(resolve("dist", "commands"), { withFileTypes: true })) {
            if (file.isFile()) {
                const cmd = await import(FileScheme + resolve(file.path, file.name)).then(x => <Command>x.default)
                this.commands.set(cmd.data.name, cmd)
            } else {
                const commandsCollection = new Collection<string, Command>()

                for (const secondFile of readdirSync(resolve(file.path, file.name), { withFileTypes: true })) {
                    const cmd = await import(FileScheme + resolve(secondFile.path, secondFile.name)).then(x => <Command>x.default)
                    commandsCollection.set(cmd.data.name, cmd)
                }

                this.commands.set(file.name, commandsCollection)
            }
        }
    }

    public lock(i: RepliableInteraction<"cached">) {
        if (this.locked.has(i.user.id)) {
            i.reply({
                ephemeral: true,
                content: "Sike! Wait for the previous command to finish executing ❤"
            })

            return false
        }

        this.locked.add(i.user.id)

        return true
    }

    public unlock(user: User) {
        this.locked.delete(user.id)
    }

    public isLocked(user: User) {
        return this.locked.has(user.id)
    }

    public getCommand(from: ChatInputCommandInteraction<'cached'> | AutocompleteInteraction<'cached'>) {
        const commandName = from.commandName
        const subcommandName = from.options.getSubcommand(false)

        const command = this.commands.get(commandName)

        if (command instanceof Collection) {
            return command.get(subcommandName!)
        }

        return command
    }
}