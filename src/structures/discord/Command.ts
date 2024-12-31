import { ApplicationCommandData, ApplicationCommandOptionChoiceData, ApplicationCommandOptionData, ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, BaseInteraction, ChatInputCommandInteraction, codeBlock, CommandInteractionOptionResolver, inlineCode, InteractionContextType, PermissionResolvable } from "discord.js"
import { Item, Nullable } from "../resource/Item.js"
import { spawnSync } from "child_process"
import { NekoClient } from "../../core/NekoClient.js";
import { Logger } from "../static/Logger.js";
import { Player } from "../player/Player.js";
import NekoDatabase from "../../core/NekoDatabase.js";
import { Embeds } from "../static/Embeds.js";
import { Errors } from "../static/Errors.js";
import { DiscordInteractionInterface, DiscordInteractionType, InteractionArgData } from "./DiscordInteractionHandler.js";
import { ArgType, GlobalExtrasData, Shared } from "./Shared.js";
import { Util } from "../static/Util.js";
import { Game } from "../static/Game.js";
import { PlayerInventoryItem } from "../player/PlayerInventoryItem.js";

export type EnumLike<T = any> = {
    [id: string]: T | string;
    [nu: number]: string;
};

export type GetEnum<T extends EnumLike> = T extends EnumLike<infer P> ? P : never

export type GetRealArgType<T, Enum extends EnumLike> = T extends ArgType.String ? string : T extends ArgType.InventoryItem ? PlayerInventoryItem : T extends ArgType.Player ? Player : T extends ArgType.Item ? Item : T extends ArgType.Enum ? GetEnum<Enum> : number

export type MarkArgNullable<T, B extends boolean> = B extends true ? T : Nullable<T>

export type ArgsToRecord<T> = {
    [P in keyof T as T[P] extends ArgData<infer N> ? N : never]: T[P] extends ArgData<infer _, infer Type, infer Required, infer Enum> ? MarkArgNullable<GetRealArgType<Type, Enum>, T[P]["default"] extends (...args: any) => any ? true : Required> : never
}

export interface ArgData<Name extends string = string, Type extends ArgType = ArgType, Required extends boolean = boolean, Enum extends EnumLike = EnumLike> {
    name: Name
    description: string
    type: Type
    enum?: Enum
    required?: Required
    max?: number
    default?: (this: NekoClient, input: ChatInputCommandInteraction<'cached'>) => Promise<GetRealArgType<Type, Enum>>
    min?: number
    autocomplete?(this: NekoClient, input: AutocompleteInteraction<'cached'>, query: string, extras: CommandExtrasData): Promise<ApplicationCommandOptionChoiceData[]>
}

export interface CommandExtrasData extends GlobalExtrasData {
    command: Command
}

export interface CommandData<Args extends ArgData[] = ArgData[]> {
    name: string
    defer?: boolean
    permissions?: PermissionResolvable
    description: string
    args?: Args
    execute(this: NekoClient, input: ChatInputCommandInteraction<'cached'>, args: ArgsToRecord<Args>, extras: CommandExtrasData): Promise<boolean>
}

export class Command<Args extends ArgData[] = ArgData[]> {
    public constructor(public readonly data: CommandData<Args>) {
        if (this.data.args?.length) {
            for (const arg of this.data.args)
                arg.autocomplete ??= arg.type === ArgType.InventoryItem ? 
                    Command.inventoryItemAutocomplete : 
                    arg.type === ArgType.Item ? 
                        Command.itemAutocomplete : 
                        undefined
        }
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
            await i.respond((await arg.autocomplete!.call(client, i, option.value, extras)).slice(0, 25))
        } catch (error) {
            Logger.error(error)
        }
    }

    public static async handle(i: ChatInputCommandInteraction<'cached'>) {
        const client = NekoClient.from(i)
        const command = client.manager.getCommand(i)

        if (!command) {
            await i.reply({
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

            const result = await command.execute(i, args, extras)
        } catch (error: unknown) {
            await Errors.interaction(i, error)
        } finally {
            client.manager.unlock(i.user)
        }
    }

    public async execute(...args: Parameters<CommandData["execute"]>) {
        // @ts-ignore
        return this.data.execute.call(args[0].client as NekoClient, ...args)
    }

    private async getExtras(i: ChatInputCommandInteraction<'cached'> | AutocompleteInteraction<'cached'>): Promise<CommandExtrasData> {
        return {
            command: this,
            player: await NekoDatabase.getPlayer(i.user.id)
        }
    }

    public static getRealArgType(type: ArgType): ApplicationCommandOptionType {
        switch (type) {
            case ArgType.Float: {
                return ApplicationCommandOptionType.Number
            }

            case ArgType.Item:
            case ArgType.Enum:
            case ArgType.Integer: {
                return ApplicationCommandOptionType.Integer
            }

            case ArgType.InventoryItem:
            case ArgType.Player:
            case ArgType.String: {
                return ApplicationCommandOptionType.String
            }

            default: {
                throw new Error(`Unable to get real arg type for ${ArgType[type]}`)
            }
        }
    }

    public static async itemAutocomplete(i: AutocompleteInteraction<'cached'>, q: string) {
        return Util.formatResourceChoices(Util.searchMany(
            Game.RawItems,
            q,
            el => el.id,
            el => el.name
        ))
    }

    public static async inventoryItemAutocomplete(i: AutocompleteInteraction<'cached'>, q: string, extras: CommandExtrasData) {
        return Util.formatChoices(
            extras.player.inventory.search(q),
            el => el.detailedName(false),
            el => el.uuid!
        )
    }
}