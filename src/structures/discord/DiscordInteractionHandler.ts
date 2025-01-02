import { AutocompleteInteraction, BaseInteraction, ButtonInteraction, CacheType, ChannelSelectMenuInteraction, Interaction, InteractionType, MentionableSelectMenuInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js"
import { NekoClient } from "../../core/NekoClient.js"
import NekoDatabase from "../../core/NekoDatabase.js"
import { ArgData, ArgsToArray, ArgType, GlobalExtrasData, InteractionPayload, Shared } from "./Shared.js"
import { InteractionError } from "../static/errors/InteractionError.js"

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

export interface DiscordInteractionHandlerData<T extends DiscordInteractionType = DiscordInteractionType, Args extends ArgData[] = ArgData[]>  {
    type: T
    id: number
    args?: [...Args]
    ownerOnly?: boolean
    execute(this: NekoClient, payload: InteractionPayload<DiscordInteractionInterface[T], InteractionExtrasData, Args>): Promise<boolean>
}

export class DiscordInteractionHandler<T extends DiscordInteractionType = DiscordInteractionType, Args extends ArgData[] = ArgData[]> {
    public static readonly CustomIdSplitter = /_/g

    public constructor(private readonly data: DiscordInteractionHandlerData<T, Args>) {}

    public get type() {
        return this.data.type
    }

    public id(...args: ArgsToArray<Args>) {
        return [ this.data.id, ...args.map(x => x?.id ?? x?.toString() ?? "") ].join("_")
    }

    public get bindedId() {
        return this.id.bind(this)
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

            const result = await handler.data.execute.call(
                client,
                {
                    args,
                    extras,
                    instance: i
                }
            )
        } catch (error: unknown) {
            await InteractionError.from(i, error)
        } finally {
            client.manager.unlock(i.user)
        }
    }

    private async getExtras(i: DiscordInteractionInterface[DiscordInteractionType]): Promise<InteractionExtrasData> {
        return {
            handler: this as never,
            player: await NekoDatabase.getPlayerByUser(i.user)
        }
    }
}