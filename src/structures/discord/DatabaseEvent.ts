import { BaseEvent, IBaseEventData } from './BaseEvent.js';
import { ICacheEvents } from '../util/Cache.js';
import { Player } from '../entity/player/Player.js';
import { NekoClient } from '../../core/NekoClient.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDatabaseEvent<K extends keyof ICacheEvents<string, Player>>
extends IBaseEventData<K,Parameters<ICacheEvents<string, Player>[K]>> {
    // TODO: Extend with additional interaction Arg data
}

export class DatabaseEvent<K extends keyof ICacheEvents<string, Player>> extends BaseEvent<IDatabaseEvent<K>> {
    public attach(client: NekoClient): void {
        // @ts-ignore : Doesn't work without.
        client.db.cache.players.on(this.data.listener, this.data.execute.bind(client));
    }
}