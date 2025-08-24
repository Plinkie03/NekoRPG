import {
	ArgType,
	EnumLike,
	IArgData,
	IBaseArgData,
	IBaseCommandData,
	Identifiable,
	IExtrasData,
	NekoResources,
	Nullable,
	UnwrapArgs,
} from '@nekorpg'
import {
	BaseInteraction,
	ButtonInteraction,
	CacheType,
	ChannelSelectMenuInteraction,
	ChatInputCommandInteraction,
	ComponentType,
	MentionableSelectMenuInteraction,
	MessageComponentInteraction,
	RoleSelectMenuInteraction,
	StringSelectMenuInteraction,
} from 'discord.js'

export enum InteractionType {
	Button,
	StringMenu,
	RoleMenu,
	ChannelMenu,
	MentionableMenu,
}

export interface InteractionInterface<T extends CacheType = 'cached'> {
	[InteractionType.Button]: ButtonInteraction<T>
	[InteractionType.ChannelMenu]: ChannelSelectMenuInteraction
	[InteractionType.MentionableMenu]: MentionableSelectMenuInteraction
	[InteractionType.RoleMenu]: RoleSelectMenuInteraction
	[InteractionType.StringMenu]: StringSelectMenuInteraction
}

export interface InteractionArgData<
	Type extends ArgType = ArgType,
	Enum extends EnumLike = EnumLike
> extends IBaseArgData<Type, Enum> {}

export interface InteractionData<
	Type extends InteractionType,
	Args extends InteractionArgData[]
> extends IBaseCommandData<Args, InteractionInterface[Type]> {
	id: number
	type: Type
}

export class Interaction<
	Type extends InteractionType = InteractionType,
	Args extends InteractionArgData[] = InteractionArgData[]
> {
	private static readonly _Splits = '_'

	public constructor(
		public readonly data: InteractionData<Type, [...Args]>
	) {}

	public id(...params: UnwrapArgs<Args>) {
		return [this.data.id, ...params]
			.map(
				(x) =>
					`${
						!!x && typeof x === 'object'
							? (x as any).uuid ?? (x as any).id
							: x
					}`
			)
			.join(Interaction._Splits)
	}

	public async parseArgs(
		interaction: MessageComponentInteraction<'cached'>,
		raw: string[],
		extras: IExtrasData
	) {
		const args = new Array()

		if (this.data.args) {
			for (let i = 0; i < this.data.args.length; i++) {
				const arg = this.data.args[i]
				let value = raw[i] || (null as any)

				if (value !== null) {
					switch (arg.type) {
						case ArgType.Enum:
						case ArgType.Float: {
							value = Number(value)
							break
						}

						case ArgType.Integer: {
							value = Math.floor(Number(value))
							break
						}

						case ArgType.InventoryItem: {
							value = extras.player.inventory.findByUUID(value)
							break
						}

						case ArgType.String: {
							break
						}

						case ArgType.Item: {
							value = NekoResources.Items.get(Number(value))
						}
					}
				}

				if (value === null && arg.required) {
					return null
				}

				args.push(value)
			}
		}

		return args as UnwrapArgs<Args>
	}
}
