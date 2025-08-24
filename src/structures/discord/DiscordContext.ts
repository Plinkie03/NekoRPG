import { IBaseArgData, IExtrasData, UnwrapArgs } from '@nekorpg'
import {
	AutocompleteInteraction,
	BaseInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	MessageComponentInteraction,
	SelectMenuInteraction,
} from 'discord.js'

export interface IDiscordContextData<
	Exec,
	Args extends IBaseArgData[],
	Extras extends IExtrasData
> {
	input: Exec
	query?: string
	args: UnwrapArgs<Args>
	extras: Extras
}

export type AutocompleteDiscordContext = DiscordContext<
	AutocompleteInteraction,
	[],
	IExtrasData
>

export type AnyDiscordContext = DiscordContext<
	MessageComponentInteraction | ChatInputCommandInteraction,
	any[],
	IExtrasData
>

export type AnyDiscordUpdatableContext = DiscordContext<
	MessageComponentInteraction,
	any[],
	IExtrasData
>

export class DiscordContext<
	Exec,
	Args extends IBaseArgData[],
	Extras extends IExtrasData
> {
	public constructor(
		public readonly data: IDiscordContextData<Exec, Args, Extras>
	) {}

	public get input() {
		return this.data.input
	}

	public get query() {
		return this.data.query!
	}

	public get extras() {
		return this.data.extras
	}

	public get args() {
		return this.data.args
	}
}
