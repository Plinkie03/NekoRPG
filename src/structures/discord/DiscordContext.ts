import { IBaseArgData, IExtrasData, UnwrapArgs } from '@nekorpg'
import {
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
	args: UnwrapArgs<Args>
	extras: Extras
}

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

	public get extras() {
		return this.data.extras
	}

	public get args() {
		return this.data.args
	}
}
