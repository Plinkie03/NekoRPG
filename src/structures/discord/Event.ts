import { NekoClient } from '@nekorpg'
import { ClientEvents } from 'discord.js'

export interface IEventData<T extends keyof ClientEvents> {
	execute: (this: NekoClient, ...args: ClientEvents[T]) => any
}

export class Event<T extends keyof ClientEvents = keyof ClientEvents> {
	public constructor(public readonly data: IEventData<T>) {}
}
