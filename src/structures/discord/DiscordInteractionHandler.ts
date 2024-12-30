import { AutocompleteInteraction, BaseInteraction, ButtonInteraction, CacheType, ChannelSelectMenuInteraction, Interaction, InteractionType, MentionableSelectMenuInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js"
import { NekoClient } from "../../core/NekoClient.js"
import { Errors } from "../static/Errors.js"
import NekoDatabase from "../../core/NekoDatabase.js"
import { ArgType, GlobalExtrasData, Shared } from "./Shared.js"
import { MarkArgNullable, GetRealArgType, EnumLike } from "./Command.js"

export enum DiscordInteractionType {
    Button,
    StringMenu,
    RoleMenu,
    UserMenu,
    MentionableMenu,
    ChannelMenu,
    Modal
}

export interface DiscordInteractionInterface<T extends CacheType = "cached"> {
    [DiscordInteractionType.Button]: ButtonInteraction<T>
    [DiscordInteractionType.ChannelMenu]: ChannelSelectMenuInteraction<T>
    [DiscordInteractionType.MentionableMenu]: MentionableSelectMenuInteraction<T>
    [DiscordInteractionType.Modal]: ModalSubmitInteraction<T>
    [DiscordInteractionType.RoleMenu]: RoleSelectMenuInteraction<T>
    [DiscordInteractionType.StringMenu]: StringSelectMenuInteraction<T>
    [DiscordInteractionType.UserMenu]: UserSelectMenuInteraction<T>
}

export interface InteractionExtrasData extends GlobalExtrasData {
    handler: DiscordInteractionHandler
}

export interface InteractionArgData<Name extends string = string, Type extends ArgType = ArgType, Required extends boolean = boolean, Enum extends EnumLike = EnumLike> {
    name: Name
    type: Type
    enum?: Enum
    required?: Required
}

type GetArgType<A> = A extends InteractionArgData<infer _, infer T, infer B, infer E> ? MarkArgNullable<GetRealArgType<T, E>, B> : never

type ArgsToRecord<T> = {
    [P in keyof T as T[P] extends InteractionArgData<infer N> ? N : never]: GetArgType<T[P]>
}

type ArgsToArray<T> = T extends [ infer L, ...infer R ] ? [
    GetArgType<L>,
    ...ArgsToArray<R>
] : []

export interface DiscordInteractionHandlerData<T extends DiscordInteractionType = DiscordInteractionType, Args extends InteractionArgData[] = InteractionArgData[]>  {
    type: T
    id: number
    args?: [...Args]
    ownerOnly?: boolean
    execute(this: NekoClient, i: DiscordInteractionInterface[T], args: ArgsToRecord<Args>, extras: InteractionExtrasData): Promise<boolean>
}

export class DiscordInteractionHandler<T extends DiscordInteractionType = DiscordInteractionType, Args extends InteractionArgData[] = InteractionArgData[]> {
    public static readonly CustomIdSplitter = /_/g

    public constructor(private readonly data: DiscordInteractionHandlerData<T, Args>) {}

    public get type() {
        return this.data.type
    }

    public id(...args: ArgsToArray<Args>) {
        return [ this.data.id, ...args.map(x => x?.id ?? x?.toString() ?? "") ].join("_")
    }

    public static async handle(i: DiscordInteractionInterface[DiscordInteractionType]) {
        const client = NekoClient.from(i)
        const [ id, ...rawArgs ] = i.customId.split(DiscordInteractionHandler.CustomIdSplitter)

        const handler = client.manager.interactions.get(Number(id))

        if (!handler) {
            await i.reply({
                ephemeral: true,
                content: `Wow, where is this interaction handler?`
            })
            return
        }

        if (!client.manager.lock(i)) return

        try {
            const extras = await handler.getExtras(i)
            const args = await Shared.resolve<any>({
                args: handler.data.args,
                extras,
                rawArgs,
                resolver: i
            })

            if (args === null) return
            
            if (handler.data.ownerOnly && !rawArgs.includes(i.user.id)) {
                await i.reply({
                    content: `You can't interact with this, sweetie.`
                })
                return
            }

            const result = await handler.execute(i, args, extras)
        } catch (error: unknown) {
            await Errors.interaction(i, error)
        } finally {
            client.manager.unlock(i.user)
        }
    }

    private execute(...args: Parameters<DiscordInteractionHandlerData["execute"]>) {
        // @ts-ignore
        return this.data.execute.call(args[0].client as NekoClient, ...args)
    }

    private async getExtras(i: DiscordInteractionInterface[DiscordInteractionType]): Promise<InteractionExtrasData> {
        return {
            handler: this as never,
            player: await NekoDatabase.getPlayer(i.user.id)
        }
    }
}