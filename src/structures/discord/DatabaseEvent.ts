import { ClientEvents } from "discord.js";
import { BaseEvent, IBaseEventData } from "./BaseEvent.js";
import { ICacheEvents } from "../util/Cache.js";
import { Player } from "../entity/player/Player.js";
import { NekoClient } from "../../core/NekoClient.js";

export interface IDatabaseEvent<K extends keyof ICacheEvents<string, Player>> extends IBaseEventData<K, Parameters<ICacheEvents<string, Player>[K]>> {}

export class DatabaseEvent<K extends keyof ICacheEvents<string, Player>> extends BaseEvent<IDatabaseEvent<K>> {
    public attach(client: NekoClient): void {
        // @ts-ignore
        client.db.cache.players.on(this.data.listener, this.data.execute.bind(client))
    }
}