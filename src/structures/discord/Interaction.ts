import { BaseInteraction, ButtonInteraction, CacheType, ChannelSelectMenuInteraction, ChatInputCommandInteraction, MentionableSelectMenuInteraction, MessageComponentInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { ArgType, BaseHandler, IBaseArgData, IBaseHandlerData, IBaseHandlerExecutionData, Nullable, UnwrapArgs } from "./BaseHandler.js";
import { NekoClient } from "../../core/NekoClient.js";

export enum InteractionType {
    Button,
    StringMenu,
    MentionableMenu,
    RoleMenu,
    ChannelMenu,
    UserMenu,
    Modal
}

export interface InteractionMappings<T extends CacheType = 'cached'> {
    [InteractionType.Button]: ButtonInteraction<T>
    [InteractionType.ChannelMenu]: ChannelSelectMenuInteraction<T>
    [InteractionType.MentionableMenu]: MentionableSelectMenuInteraction<T>
    [InteractionType.RoleMenu]: RoleSelectMenuInteraction<T>
    [InteractionType.UserMenu]: UserSelectMenuInteraction<T>
    [InteractionType.Modal]: ModalSubmitInteraction<T>
    [InteractionType.StringMenu]: StringSelectMenuInteraction<T>
}

export interface InteractionArgData extends IBaseArgData {}

export interface InteractionExecutionData<Type extends InteractionType, Args extends [...InteractionArgData[]] = InteractionArgData[]> extends IBaseHandlerExecutionData<InteractionMappings[Type], Args> {}

export interface InteractionData<Type extends InteractionType, Args extends [...InteractionArgData[]]> extends IBaseHandlerData<Args, InteractionExecutionData<Type, Args>> {
    id: number
    type: Type
}

export class Interaction<Type extends InteractionType = InteractionType, Args extends [...InteractionArgData[]] = InteractionArgData[]> extends BaseHandler<InteractionData<Type, Args>> {
    private static readonly _CustomIdSplits = "_"

    public id(...args: UnwrapArgs<Args>) {
        return [this.data.id, ...args].map(x => `${typeof x === "object" && x !== null && "id" in x ? x.id : x}`).join(Interaction._CustomIdSplits)
    }

    private async _resolveArgs(interaction: InteractionMappings[keyof InteractionMappings], rawArgs: string[]): Promise<Nullable<UnwrapArgs<Args>>> {
        const arr = new Array()
        if (!this.data.args?.length)
            return <never>arr

        for (let i = 0;i < this.data.args.length;i++) {
            const arg = this.data.args[i]
            const raw = rawArgs[i]

            let value;

            switch (arg.type) {
                case ArgType.Float:
                case ArgType.Integer:
                case ArgType.Enum:
                    value = Number(raw)
                    break

                case ArgType.String:
                    value = raw
                    break
            }

            if ((value === undefined || value === "") && arg.required) {
                return null
            }

            arr.push(value ?? null)
        }

        return <never>arr
    }

    public static async handle(client: NekoClient, interaction: InteractionMappings[keyof InteractionMappings]) {
        const [ id, ...rawArgs ] = interaction.customId.split(Interaction._CustomIdSplits)

        const handler = client.interactions.get(Number(id))
        if (!handler)
            return

        try {
            const args = await handler._resolveArgs(interaction, rawArgs)
            if (!args)
                return

            await handler.data.execute.call(client, {
                args,
                extras: {},
                interaction
            })
        } catch (error) {
            
        }
    }
}