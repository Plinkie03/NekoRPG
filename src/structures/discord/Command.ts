import {
	AutocompleteDiscordContext,
	BaseItem,
	DiscordContext,
	Enum,
	EnumLike,
	GetEnum,
	NekoClient,
	NekoDatabase,
	NekoResources,
	Nullable,
	Player,
	PlayerInventoryItem,
} from '@nekorpg'
import {
	ApplicationCommandData,
	ApplicationCommandOptionChoiceData,
	ApplicationCommandOptionType,
	AutocompleteInteraction,
	BaseInteraction,
	ChatInputCommandInteraction,
} from 'discord.js'

export enum ArgType {
	String,
	Integer,
	Item,
	Float,
	InventoryItem,
	Enum,
}

export interface IBaseArgData<
	Type extends ArgType = ArgType,
	Enum extends EnumLike = EnumLike
> {
	type: Type
	enum?: Enum
	required?: boolean
}

export interface IBaseCommandData<
	Args extends IBaseArgData[],
	ExecutionContext
> {
	args?: Args
	execute: (
		this: NekoClient,
		ctx: DiscordContext<ExecutionContext, Args, IExtrasData>
	) => Promise<boolean> | boolean
}

export interface IArgData<
	Type extends ArgType = ArgType,
	Enum extends EnumLike = EnumLike
> extends IBaseArgData<Type, Enum> {
	name: string
	description: string
	autocomplete?: (
		this: NekoClient,
		ctx: AutocompleteDiscordContext
	) => Nullable<ApplicationCommandOptionChoiceData[]> | undefined
}

export interface ICommandData<Args extends IArgData[]>
	extends IBaseCommandData<Args, ChatInputCommandInteraction<'cached'>> {
	name: string
	description: string
}

export type UnwrapArgType<
	Type extends ArgType,
	Enum extends EnumLike
> = Type extends ArgType.Item
	? BaseItem
	: Type extends ArgType.InventoryItem
	? PlayerInventoryItem
	: Type extends ArgType.Enum
	? GetEnum<Enum>
	: Type extends ArgType.String
	? string
	: number

export type TryMarkNullable<T, R extends boolean> = R extends true
	? T
	: Nullable<T>

export type UnwrapArg<Arg> = Arg extends IBaseArgData<infer Type, infer Enum>
	? TryMarkNullable<
			UnwrapArgType<Type, Enum>,
			Arg['required'] extends boolean ? Arg['required'] : false
	  >
	: never

export type UnwrapArgs<Args> = Args extends [infer L, ...infer R]
	? [UnwrapArg<L>, ...UnwrapArgs<R>]
	: []

export interface IExtrasData {
	player: Player
}

export class Command<Args extends IArgData[] = IArgData[]> {
	public constructor(public readonly data: ICommandData<[...Args]>) {
		if (this.data.args?.length) {
			for (const arg of this.data.args) {
				switch (arg.type) {
					case ArgType.Item: {
						arg.autocomplete = Command._itemAutocomplete
						break
					}

					case ArgType.InventoryItem: {
						arg.autocomplete = Command._inventoryItemAutocomplete
						break
					}

					default: {
						break
					}
				}
			}
		}
	}

	public toJSON(): ApplicationCommandData {
		return {
			name: this.data.name,
			description: this.data.description,
			options: this.data.args?.map((x) => ({
				name: x.name,
				description: x.description,
				autocomplete: !!x.autocomplete,
				required: x.required,
				choices: x.enum
					? Enum.values(x.enum).map((x) => ({
							name: x.enum[x],
							value: x,
					  }))
					: undefined,
				type: Command.getDiscordOptionType(x.type),
			})) as never,
		}
	}

	public static getDiscordOptionType(
		type: ArgType
	): ApplicationCommandOptionType {
		switch (type) {
			case ArgType.Float:
				return ApplicationCommandOptionType.Number
			case ArgType.Enum:
			case ArgType.Item:
			case ArgType.Integer:
				return ApplicationCommandOptionType.Integer
			case ArgType.InventoryItem:
			case ArgType.String:
				return ApplicationCommandOptionType.String
		}
	}

	public async parseArgs(
		i: ChatInputCommandInteraction<'cached'>,
		extras: IExtrasData
	) {
		const args = new Array()

		if (this.data.args?.length) {
			for (const arg of this.data.args) {
				let value

				switch (arg.type) {
					case ArgType.InventoryItem: {
						value = extras.player.inventory.findByUUID(
							i.options.getString(arg.name, arg.required)
						)
						break
					}

					case ArgType.Float: {
						value = i.options.getNumber(arg.name, arg.required)
						break
					}

					case ArgType.Enum:
					case ArgType.Integer: {
						value = i.options.getInteger(arg.name, arg.required)
						break
					}

					case ArgType.String: {
						value = i.options.getString(arg.name, arg.required)
						break
					}

					case ArgType.Item: {
						value = arg.required
							? NekoResources.Items.get(
									i.options.getInteger(
										arg.name,
										arg.required
									)!
							  )
							: undefined
					}
				}

				args.push((value ??= null))
			}
		}

		return args as UnwrapArgs<Args>
	}

	public static async getExtras(
		i: BaseInteraction<'cached'>
	): Promise<IExtrasData> {
		return {
			player: await NekoDatabase.rawPlayer.get(i.user),
		}
	}

	private static _itemAutocomplete(
		ctx: Parameters<Exclude<IArgData['autocomplete'], undefined>>[0]
	): ApplicationCommandOptionChoiceData[] {
		return NekoResources.Items.searchMany(ctx.query, (item) => ({
			name: item.name,
			value: item.id,
		}))
	}

	private static _inventoryItemAutocomplete(
		ctx: Parameters<Exclude<IArgData['autocomplete'], undefined>>[0]
	): ApplicationCommandOptionChoiceData[] {
		return ctx.extras.player.inventory.searchMany(ctx.query, (item) => ({
			name: item.name,
			value: item.id,
		}))
	}
}
