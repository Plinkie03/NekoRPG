import { join, resolve } from "path";
import { NekoClient } from "./NekoClient.js";
import { BaseEvent } from "../structures/discord/BaseEvent.js";
import { readdirSync } from "fs";
import { Importer } from "../structures/util/Importer.js";

export class NekoEvents {
    private static readonly _Path = resolve("dist", "events")
    
    private readonly _events = new Array<BaseEvent>()
    
    public constructor(private readonly _client: NekoClient) {}

    public async load() {
        for (const file of readdirSync(NekoEvents._Path, { recursive: true, withFileTypes: true }).filter(x => x.isFile())) {
            const event = await Importer.import<BaseEvent>(join(file.path, file.name))
            event.attach(this._client)
            this._events.push(event)
        }
    }
}