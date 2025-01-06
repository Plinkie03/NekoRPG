import { ApplicationCommandData, ApplicationCommandOptionChoiceData, ApplicationCommandOptionData, ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, BaseInteraction, ChatInputCommandInteraction, codeBlock, CommandInteractionOptionResolver, inlineCode, InteractionContextType, PermissionResolvable } from "discord.js"
import { Item, Nullable } from "../resource/Item.js"
import { spawnSync } from "child_process"
import { NekoClient } from "../../core/NekoClient.js";
import { Logger } from "../static/Logger.js";
import { Player } from "../player/Player.js";
import NekoDatabase from "../../core/NekoDatabase.js";
import { DiscordInteractionInterface, DiscordInteractionType } from "./DiscordInteractionHandler.js";
import { ArgData, ArgsToArray, ArgType, AutocompletePayload, GlobalExtrasData, InteractionPayload, Shared } from "./Shared.js";
import { Util } from "../static/Util.js";
import { Game } from "../static/Game.js";
import { PlayerInventoryItem } from "../player/PlayerInventoryItem.js";
import { InteractionError } from "../static/errors/InteractionError.js";

export interface CommandExtrasData extends GlobalExtrasData {
    command: Command
}

export interface CommandData<Args extends ArgData[] = ArgData[]> {
    name: string
    defer?: boolean
    permissions?: PermissionResolvable
    description: string
    args?: [...Args]
    execute(this: NekoClient, payload: InteractionPayload<ChatInputCommandInteraction<'cached'>, CommandExtrasData, Args>): Promise<boolean>
}

export class Command<Args extends ArgData[] = ArgData[]> {
    public constructor(public readonly data: CommandData<Args>) {
        if (this.data.args?.length) {
            for (const arg of this.data.args)
                arg.autocomplete ??= arg.type === ArgType.InventoryItem ? 
                    Command.inventoryItemAutocomplete : 
                    arg.type === ArgType.Item ? 
                        Command.itemAutocomplete : 
                        arg.type === ArgType.Node ?
                            Command.nodeAutocomplete :
                            arg.type === ArgType.Monster ?
                                Command.monsterAutocomplete :
                                arg.type === ArgType.ZoneMonster ?
                                    Command.zoneMonsterAutocomplete :
                                    arg.type === ArgType.ZoneNode ?
                                        Command.zoneNodeAutocomplete :
                                        arg.type === ArgType.Player ?
                                            Command.playerAutocomplete :
                                            undefined
        }
    }

    public get args(): ArgsToArray<Args> {
        throw ""
    }

    public toJSON(): ApplicationCommandData {
        return {
            name: this.data.name,
            description: this.data.description,
            defaultMemberPermissions: this.data.permissions,
            dmPermission: false,
            type: ApplicationCommandType.ChatInput,
            // @ts-ignore Annoying typings
            options: this.data.args?.map(
                x => ({
                    name: x.name,
                    description: x.description,
                    min_length: x.min,
                    minLength: x.min,
                    max_length: x.max,
                    maxLength: x.max,
                    autocomplete: !!x.autocomplete,
                    choices: x.enum ? Object.entries(x.enum).filter(x => isNaN(Number(x[0]))).map(x => ({
                        name: x[0],
                        value: x[1]
                    })) : undefined,
                    required: x.required,
                    type: Command.getRealArgType(x.type) as ApplicationCommandOptionType
                })
            )
        }
    }

    public static async handleAutocomplete(i: AutocompleteInteraction<'cached'>) {
        const client = NekoClient.from(i)
        const command = client.manager.getCommand(i)

        if (!command) {
            return
        }

        const option = i.options.getFocused(true)
        const arg = command.data.args?.find(x => x.name === option.name)

        if (!arg) {
            return
        }

        const extras = await command.getExtras(i)

        try {
            await i.respond((await arg.autocomplete!({
                extras,
                query: option.value,
                instance: i
            })).slice(0, 25))
        } catch (error) {
            Logger.error(error)
        }
    }

    public static async handle(i: ChatInputCommandInteraction<'cached'>) {
        const client = NekoClient.from(i)
        const command = client.manager.getCommand(i)

        if (!command) {
            await Util.reply(i, {
                ephemeral: true,
                content: `Command not found... how'd you get this?`
            })

            return
        }

        if (!client.manager.lock(i)) return

        try {
            const extras = await command.getExtras(i)

            const args = await Shared.resolve<any>({
                resolver: i,
                args: command.data.args,
                extras
            })
            
            if (args === null) {
                throw null
            }

            if (command.data.defer)
                await i.deferReply({ ephemeral: command.data.defer })

            const result = await command.data.execute.call(
                client,
                {
                    args,
                    instance: i,
                    extras
                }
            )
        } catch (error: unknown) {
            await InteractionError.from(i, error)
        } finally {
            client.manager.unlock(i.user)
        }
    }

    private async getExtras(i: ChatInputCommandInteraction<'cached'> | AutocompleteInteraction<'cached'>): Promise<CommandExtrasData> {
        return {
            command: this,
            player: await NekoDatabase.getPlayerByUser(i.user)
        }
    }

    public static getRealArgType(type: ArgType): ApplicationCommandOptionType {
        switch (type) {
            case ArgType.Float: {
                return ApplicationCommandOptionType.Number
            }
            
            case ArgType.Node:
            case ArgType.ZoneNode:
            case ArgType.Monster:
            case ArgType.ZoneMonster:
            case ArgType.Item:
            case ArgType.Enum:
            case ArgType.Integer: {
                return ApplicationCommandOptionType.Integer
            }

            case ArgType.Player:
            case ArgType.User: {
                return ApplicationCommandOptionType.User
            }

            case ArgType.InventoryItem:
            case ArgType.String: {
                return ApplicationCommandOptionType.String
            }
        }
    }

    public static async itemAutocomplete(payload: AutocompletePayload) {
        return Util.formatResourceChoices(Util.searchMany(
            Game.RawItems,
            payload.query,
            el => el.id,
            el => el.name
        ))
    }

    public static async nodeAutocomplete(payload: AutocompletePayload) {
        return Util.formatResourceChoices(Util.searchMany(
            Game.RawNodes,
            payload.query,
            el => el.id,
            el => el.name
        ))
    }

    public static async monsterAutocomplete(payload: AutocompletePayload) {
        return Util.formatChoices(
            Util.searchMany(
                Game.RawMonsters,
                payload.query,
                el => el.id,
                el => el.displayName + el.displayLevel
            ),
            el => el.displayName + el.displayLevel,
            el => el.id
        )
    }

    public static async playerAutocomplete(payload: AutocompletePayload) {
        return Util.formatChoices(
            await NekoDatabase.queryPlayers(payload.query),
            el => el.username,
            el => el.id
        )
    }

    public static async zoneMonsterAutocomplete(payload: AutocompletePayload) {
        return Util.formatChoices(
            Util.searchMany(
                payload.extras.player.zone.monsters,
                payload.query,
                el => el.id,
                el => el.displayName + el.displayLevel
            ),
            el => el.displayName + el.displayLevel,
            el => el.id
        )
    }

    public static async zoneNodeAutocomplete(payload: AutocompletePayload) {
        return Util.formatResourceChoices(Util.searchMany(
            payload.extras.player.zone.nodes,
            payload.query,
            el => el.id,
            el => el.name
        ))
    }

    public static async inventoryItemAutocomplete(payload: AutocompletePayload) {
        return Util.formatChoices(
            payload.extras.player.inventory.search(payload.query),
            el => el.detailedName(false),
            el => el.uuid!
        )
    }
}