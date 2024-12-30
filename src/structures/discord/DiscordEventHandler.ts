import { ClientEvents } from "discord.js";
import { NekoClient } from "../../core/NekoClient.js";

export interface DiscordEventHandlerData<T extends keyof ClientEvents> {
    name: T
    once?: boolean
    listener: (this: NekoClient, ...args: ClientEvents[T]) => any
}

export class DiscordEventHandler<T extends keyof ClientEvents = keyof ClientEvents> {
    public constructor(private readonly data: DiscordEventHandlerData<T>) {}

    public get name() {
        return this.data.name
    }

    public get listener() {
        return this.data.listener
    }

    public get once() {
        return !!this.data.once
    }
}