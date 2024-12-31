import { ChatInputCommandInteraction, BaseInteraction, inlineCode } from "discord.js"
import { DiscordInteractionInterface, DiscordInteractionType, InteractionExtrasData } from "./DiscordInteractionHandler.js"
import { Player } from "../player/Player.js"
import { NekoClient } from "../../core/NekoClient.js"
import { Embeds } from "../static/Embeds.js"
import { ArgData } from "./Command.js"
import NekoDatabase from "../../core/NekoDatabase.js"
import { Game } from "../static/Game.js"

export enum ArgType {
    Integer,
    Float,
    String,
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
        } else {
            id = options.resolver.getString(options.arg.name, options.arg.required)
        }

        return id ? NekoDatabase.getPlayer(id) : id
    }

    public static async resolve<T>(options: ResolveOptions): Promise<T | null> {
        const output = {} as any

        if (!options.args?.length) return output

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
                    output[arg.name] = null
                    continue
                }
            }

            const resolved = await Shared[arg.type]({
                arg,
                value,
                resolver: resolver as any,
                extras: options.extras
            }) ?? ("default" in arg ? arg.default?.call(options.resolver.client as NekoClient, options.resolver as never) : undefined)
            if (resolved === undefined && arg.required) {
                return reject()
            }

            output[arg.name] = resolved ?? null
        }

        return output
    }

    private static async reject(i: BaseInteraction<'cached'>, arg: ArgData, given?: unknown) {
        const embed = Embeds.basic(i, i.user, "Red")
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
            await i[(i.replied ? "editReply" : "reply") as unknown as "reply"]({
                embeds: [
                    embed
                ],
                content: "",
                ephemeral: true
            })
        }

        return null
    }
}