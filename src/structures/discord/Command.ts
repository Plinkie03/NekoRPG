import { ApplicationCommandData, ApplicationCommandOptionChoiceData, AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { ArgType, BaseHandler, IBaseArgData, IBaseHandlerData, IBaseHandlerExecutionData, Nullable, UnwrapArgs } from './BaseHandler.js';
import { NekoClient } from '../../core/NekoClient.js';
import { Enum } from '../util/Enum.js';

export interface ICommandArgData extends IBaseArgData {
    name: string
    description: string
    autocomplete?: (this: NekoClient, interaction: AutocompleteInteraction<'cached'>, query: string) => Promise<ApplicationCommandOptionChoiceData[]>
    max?: number
    min?: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICommandExecutionData<Args extends [...ICommandArgData[]] = ICommandArgData[]> extends IBaseHandlerExecutionData<ChatInputCommandInteraction<'cached'>, Args> {
    // TODO: Extend with additional Command Args
}

export interface ICommandData<Args extends [...ICommandArgData[]]> extends IBaseHandlerData<Args, ICommandExecutionData<Args>> {
    name: string
    description: string
}

export class Command<Args extends [...ICommandArgData[]] = ICommandArgData[]> extends BaseHandler<ICommandData<Args>> {
    public constructor(data: ICommandData<Args>) {
        super(data);
        this._assignAutocompleteFunctions();
    }

    private _assignAutocompleteFunctions() {

    }

    // NOTE: Added _ to vars for eslint, remove once you use it.
    private async _playerAutocomplete(...[_i, _q]: Parameters<Exclude<ICommandArgData['autocomplete'], undefined>>): Promise<ApplicationCommandOptionChoiceData[]> {
        return [];
    }

    public static async handle(client: NekoClient, interaction: ChatInputCommandInteraction<'cached'>) {
        const command = client.commands.get(interaction);

        if (!command) {
            return;
        }

        try {
            const args = await command._resolveArgs(interaction);
            if (!args) {
                return;
            }

            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */ // NOTE: Will be used lated.
            const result = await command.data.execute.call(client, {
                args,
                extras: {},
                interaction,
            });

        } catch (error) {
            // TODO add error handling ()
            console.log('Error:' + error);
        }
    }

    public static async handleAutocomplete(client: NekoClient, interaction: AutocompleteInteraction<'cached'>) {
        const command = client.commands.get(interaction);
        if (!command) {
            return;
        }

        const option = interaction.options.getFocused(true);

        const arg = command.data.args?.find(x => x.name === option.name);
        if (!arg) {
            return;
        }

        try {
            const results = await arg.autocomplete?.call(client, interaction, option.value);
            await interaction.respond(results?.slice(0, 25) ?? []);
        } catch (error) {
            // TODO add error handling ()
            console.log('Error:' + error);
        }
    }

    private async _resolveArgs(i: ChatInputCommandInteraction<'cached'>): Promise<Nullable<UnwrapArgs<Args>>> {
        const arr: (string | number | null)[] = [];
        if (!this.data.args?.length) {
            return <never>arr;
        }

        for (const arg of this.data.args) {
            let value;

            switch (arg.type) {
                case ArgType.Integer:
                case ArgType.Enum:
                    value = i.options.getInteger(arg.name, arg.required);
                    break;

                case ArgType.Float:
                    value = i.options.getNumber(arg.name, arg.required);
                    break;

                case ArgType.String:
                    value = i.options.getString(arg.name, arg.required);
                    break;
            }

            arr.push(value ?? null);
        }

        return <never>arr;
    }

    public toJSON(): ApplicationCommandData {
        return {
            name: this.data.name,
            description: this.data.description,
            nsfw: false,
            options: <never>this.data.args?.map(x => ({
                name: x.name,
                description: x.description,
                autocomplete: !!x.autocomplete,
                max_length: x.max,
                max_value: x.max,
                choices: x.enum ? Enum.values(x.enum).map(value => ({
                    name: x.enum![value],
                    value: value,
                })) : undefined,
                min_length: x.min,
                min_value: x.min,
                required: x.required,
                type: BaseHandler.getDiscordArgType(x.type),
            })),
        };
    }
}