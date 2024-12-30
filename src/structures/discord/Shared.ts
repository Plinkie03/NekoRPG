import { ChatInputCommandInteraction, BaseInteraction, inlineCode } from "discord.js"
import { DiscordInteractionInterface, DiscordInteractionType, InteractionArgData, InteractionExtrasData } from "./DiscordInteractionHandler.js"
import { Player } from "../player/Player.js"
import { NekoClient } from "../../core/NekoClient.js"
import { Embeds } from "../static/Embeds.js"
import { ArgData } from "./Command.js"

export enum ArgType {
    Integer,
    Float,
    String,
    Enum
}

export interface GlobalExtrasData {
    player?: Player
}

export class Shared {
    private constructor() {}

    private static async [ArgType.Enum](resolver: ChatInputCommandInteraction["options"] | DiscordInteractionInterface[DiscordInteractionType], arg: ArgData | InteractionArgData, value?: string) {
        if (resolver instanceof BaseInteraction) {
            return Number(value!)
        }

        return resolver.getInteger(arg.name, arg.required)
    }

    private static async [ArgType.String](resolver: ChatInputCommandInteraction["options"] | DiscordInteractionInterface[DiscordInteractionType], arg: ArgData | InteractionArgData, value?: string) {
        if (resolver instanceof BaseInteraction) {
            return value!
        }

        return resolver.getString(arg.name, arg.required)
    }

    private static async [ArgType.Integer](resolver: ChatInputCommandInteraction["options"] | DiscordInteractionInterface[DiscordInteractionType], arg: ArgData | InteractionArgData, value?: string) {
        if (resolver instanceof BaseInteraction) {
            return Number(value!)
        }

        return resolver.getInteger(arg.name, arg.required)
    }

    private static async [ArgType.Float](resolver: ChatInputCommandInteraction["options"] | DiscordInteractionInterface[DiscordInteractionType], arg: ArgData | InteractionArgData, value?: string) {
        if (resolver instanceof BaseInteraction) {
            return Number(value!)
        }

        return resolver.getNumber(arg.name, arg.required)
    }

    public static async resolve<T>(i: BaseInteraction<'cached'>, args: InteractionArgData[] | ArgData[] | undefined, extras: GlobalExtrasData, raw?: string[]): Promise<T | null> {
        const output = {} as any

        if (!args?.length) return output

        for (let x = 0, len = args.length;x < len;x++) {
            const arg = args[x]
            const value = raw?.[x] === '' ? undefined : raw?.[x]

            const reject = this.reject.bind(null, i, arg, i instanceof ChatInputCommandInteraction ? i.options.get(arg.name, arg.required)?.value : value)

            // For interaction handler, not command
            if (raw?.length && value === undefined) {
                if (arg.required) {
                    return reject()
                } else {
                    output[arg.name] = null
                    continue
                }
            }

            const resolved = await Shared[arg.type](i instanceof ChatInputCommandInteraction ? i.options : i as never, arg, value) ?? ("default" in arg ? arg.default?.call(i.client as NekoClient, i as never) : undefined)
            if (resolved === undefined && arg.required) {
                return reject()
            }

            output[arg.name] = resolved ?? null
        }

        return output
    }

    private static async reject(i: BaseInteraction<'cached'>, arg: ArgData | InteractionArgData, given?: unknown) {
        const embed = Embeds.basic(i, i.user, "Red")

        embed.setTitle("Argument Error")
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