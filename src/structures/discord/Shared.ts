import { ChatInputCommandInteraction, BaseInteraction, inlineCode, ApplicationCommandOptionChoiceData, AutocompleteInteraction, User } from "discord.js"
import { DiscordInteractionInterface, DiscordInteractionType, InteractionExtrasData } from "./DiscordInteractionHandler.js"
import { Player } from "../player/Player.js"
import { NekoClient } from "../../core/NekoClient.js"
import NekoDatabase from "../../core/NekoDatabase.js"
import { Game } from "../static/Game.js"
import { Item, Nullable } from "../resource/Item.js"
import { PlayerInventoryItem } from "../player/PlayerInventoryItem.js"
import { CommandExtrasData } from "./Command.js"
import { emptyString } from "../../Constants.js"
import { Monster } from "../monster/Monster.js"
import { Node } from "../resource/node/Node.js"
import { BasicEmbed } from "../static/embeds/BasicEmbed.js"
import { Util } from "../static/Util.js"

export type EnumLike<T = any> = {
    [id: string]: T | string;
    [nu: number]: string;
};

export type GetEnum<T extends EnumLike> = T extends EnumLike<infer P> ? P : never

export type GetRealArgType<T, Enum extends EnumLike> = T extends ArgType.ZoneMonster ? Monster : T extends ArgType.ZoneNode ? Node : T extends ArgType.Monster ? Monster : T extends ArgType.Node ? Node : T extends ArgType.ZoneMonster ? Node : T extends ArgType.String ? string : T extends ArgType.User ? User : T extends ArgType.InventoryItem ? PlayerInventoryItem : T extends ArgType.Player ? Player : T extends ArgType.Item ? Item : T extends ArgType.Enum ? GetEnum<Enum> : number

export type MarkArgNullable<T, B extends boolean> = B extends true ? T : Nullable<T>

export type GetArgType<T> = T extends ArgData<infer Type, infer Required, infer Enum> ? MarkArgNullable<GetRealArgType<Type, Enum>, T["default"] extends (...args: any) => any ? true : Required> : never

export type ArgsToArray<T> = T extends [infer L, ...infer R] ? [
    GetArgType<L>,
    ...ArgsToArray<R>
] : []

export interface AutocompletePayload {
    instance: AutocompleteInteraction<'cached'>
    query: string
    extras: GlobalExtrasData
}

export interface ArgData<Type extends ArgType = ArgType, Required extends boolean = boolean, Enum extends EnumLike = EnumLike> {
    name: string
    description: string
    type: Type
    enum?: Enum
    required?: Required
    max?: number
    default?: (this: NekoClient, input: ChatInputCommandInteraction<'cached'>) => Promise<GetRealArgType<Type, Enum>>
    min?: number
    autocomplete?(options: AutocompletePayload): Promise<ApplicationCommandOptionChoiceData[]>
}

export enum ArgType {
    Integer,
    Monster,
    ZoneMonster,
    Node,
    ZoneNode,
    Float,
    String,
    User,
    Enum,
    Item,
    Player,
    InventoryItem
}

export interface GlobalExtrasData {
    player: Player
}

export interface ArgResolveOptions {
    resolver: ChatInputCommandInteraction["options"] | DiscordInteractionInterface[DiscordInteractionType]
    arg: ArgData
    extras: GlobalExtrasData
    value?: string
}

export interface ResolveOptions extends Omit<ArgResolveOptions, "resolver" | "value" | "arg"> {
    resolver: BaseInteraction<'cached'>
    args?: ArgData[]
    rawArgs?: string[]
}

export interface InteractionPayload<Instance extends BaseInteraction<'cached'>, Extras extends GlobalExtrasData, Args extends ArgData[]> {
    instance: Instance
    args: ArgsToArray<Args>
    extras: Extras
}

export class Shared {
    private constructor() {}

    private static async [ArgType.Enum](options: ArgResolveOptions) {
        if (options.resolver instanceof BaseInteraction) {
            return Number(options.value!)
        }

        return options.resolver.getInteger(options.arg.name, options.arg.required)
    }

    private static async [ArgType.String](options: ArgResolveOptions) {
        if (options.resolver instanceof BaseInteraction) {
            return options.value!
        }

        return options.resolver.getString(options.arg.name, options.arg.required)
    }

    private static async [ArgType.Integer](options: ArgResolveOptions) {
        if (options.resolver instanceof BaseInteraction) {
            return Number(options.value!)
        }

        return options.resolver.getInteger(options.arg.name, options.arg.required)
    }

    private static async [ArgType.Float](options: ArgResolveOptions) {
        if (options.resolver instanceof BaseInteraction) {
            return Number(options.value!)
        }

        return options.resolver.getNumber(options.arg.name, options.arg.required)
    }

    private static async [ArgType.Item](options: ArgResolveOptions) {
        let id;

        if (options.resolver instanceof BaseInteraction) {
            id = Number(options.value!)
        } else {
            id = options.resolver.getInteger(options.arg.name, options.arg.required)
        }

        return id ? Game.getItem(id) : id
    }

    private static async [ArgType.Monster](options: ArgResolveOptions) {
        let id;

        if (options.resolver instanceof BaseInteraction) {
            id = Number(options.value!)
        } else {
            id = options.resolver.getInteger(options.arg.name, options.arg.required)
        }

        return id ? Game.getMonster(id) : id
    }

    private static async [ArgType.ZoneMonster](options: ArgResolveOptions) {
        let id;

        if (options.resolver instanceof BaseInteraction) {
            id = Number(options.value!)
        } else {
            id = options.resolver.getInteger(options.arg.name, options.arg.required)
        }

        return id ? options.extras.player.zone.data.monsters?.find(x => x.id === id) : id
    }

    private static async [ArgType.ZoneNode](options: ArgResolveOptions) {
        let id;

        if (options.resolver instanceof BaseInteraction) {
            id = Number(options.value!)
        } else {
            id = options.resolver.getInteger(options.arg.name, options.arg.required)
        }

        return id ? options.extras.player.zone.data.nodes?.find(x => x.id === id) : id
    }

    private static async [ArgType.Node](options: ArgResolveOptions) {
        let id;

        if (options.resolver instanceof BaseInteraction) {
            id = Number(options.value!)
        } else {
            id = options.resolver.getInteger(options.arg.name, options.arg.required)
        }

        return id ? Game.getNode(id) : id
    }

    private static async [ArgType.User](options: ArgResolveOptions) {
        if (options.resolver instanceof BaseInteraction) {
            return options.resolver.client.users.fetch(options.value!)
        } else {
            return options.resolver.getUser(options.arg.name, options.arg.required)
        }
    }

    private static async [ArgType.InventoryItem](options: ArgResolveOptions) {
        let index;

        if (options.resolver instanceof BaseInteraction) {
            index = options.value!
        } else {
            index = options.resolver.getString(options.arg.name, options.arg.required)
        }

        return index !== null && index !== undefined ? options.extras.player.inventory.at(Number(index)) ?? options.extras.player.inventory.getItemByUUID(index) : index
    }

    private static async [ArgType.Player](options: ArgResolveOptions) {
        let id;

        if (options.resolver instanceof BaseInteraction) {
            id = options.value!
            return id ? options.resolver.client.users.fetch(id) : id
        } else {
            return options.resolver.getUser(options.arg.name, options.arg.required)
        }
    }

    public static async resolve<T>(options: ResolveOptions): Promise<T | null> {
        const output = new Array<any>()

        if (!options.args?.length) return output as T

        const resolver = options.resolver instanceof ChatInputCommandInteraction ? options.resolver.options : options.resolver

        for (let x = 0, len = options.args.length;x < len;x++) {
            const arg = options.args[x]
            const value = options.rawArgs?.[x] === '' ? undefined : options.rawArgs?.[x]

            const reject = this.reject.bind(null, options.resolver, arg, options.resolver instanceof ChatInputCommandInteraction ? options.resolver.options.get(arg.name, arg.required)?.value : value)

            // For interaction handler, not command
            if (options.rawArgs?.length && value === undefined) {
                if (arg.required) {
                    return reject()
                } else {
                    output.push(null)
                    continue
                }
            }

            const resolved = await Shared[arg.type]({
                arg,
                value,
                resolver: resolver as any,
                extras: options.extras
            }) ?? ("default" in arg ? await arg.default?.call(options.resolver.client as NekoClient, options.resolver as never) : undefined)
            if (resolved === undefined && arg.required) {
                return reject()
            }

            output.push(resolved ?? null)
        }

        return output as T
    }

    private static async reject(i: BaseInteraction<'cached'>, arg: ArgData, given?: unknown) {
        const embed = BasicEmbed.from(i, i.user, "Red")
            .setTitle("Argument Error")
            .setDescription(`The argument ${inlineCode(arg.name)} is absent or did not match the type.`)
            .addFields([
                {
                    name: "Type",
                    value: ArgType[arg.type],
                    inline: true
                },
                {
                    name: "Value",
                    value: given === undefined ? "Absent" : `${given}`,
                    inline: true
                }
            ])

        if ("customId" in i) {
            embed.addFields([
                {
                    name: "Custom ID",
                    value: i.customId as string,
                    inline: true
                }
            ])
        }

        if (i.isRepliable()) {
            await Util.reply(i, {
                embeds: [
                    embed
                ],
                content: emptyString,
                ephemeral: true
            })
        }

        return null
    }
}