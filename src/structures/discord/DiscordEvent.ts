import { ClientEvents } from 'discord.js';
import { BaseEvent, IBaseEventData } from './BaseEvent.js';
import { NekoClient } from '../../core/NekoClient.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDiscordEventData<K extends keyof ClientEvents> extends IBaseEventData<K, ClientEvents[K]> {
    // TODO: Extend with additional interaction Arg data
}

export class DiscordEvent<K extends keyof ClientEvents> extends BaseEvent<IDiscordEventData<K>> {
    public attach(client: NekoClient): void {
        client.on(this.data.listener, this.data.execute.bind(client));
    }
}