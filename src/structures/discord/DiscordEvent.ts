import { ClientEvents } from "discord.js";
import { BaseEvent, IBaseEventData } from "./BaseEvent.js";
import { NekoClient } from "../../core/NekoClient.js";

export interface IDiscordEventData<K extends keyof ClientEvents> extends IBaseEventData<K, ClientEvents[K]> {}

export class DiscordEvent<K extends keyof ClientEvents> extends BaseEvent<IDiscordEventData<K>> {
    public attach(client: NekoClient): void {
        client.on(this.data.listener, this.data.execute.bind(client))
    }
}