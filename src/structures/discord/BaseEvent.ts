import { ClientEvents } from "discord.js";
import { NekoClient } from "../../core/NekoClient.js";

export interface IBaseEventData<K, Args extends any[]> {
    listener: K
    execute: (this: NekoClient, ...args: Args) => Promise<void>
}

export abstract class BaseEvent<Data = any> {
    public constructor(public readonly data: Data) {}

    public abstract attach(client: NekoClient): void
}