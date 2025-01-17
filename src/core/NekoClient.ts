import { Base, Client } from "discord.js";
import { NekoManager } from "./NekoManager.js";
import { Game } from "../structures/static/Game.js";

export class NekoClient extends Client<true> {
    public readonly manager = new NekoManager(this)

    public async login(token?: string): Promise<string> {
        await Game.init()
        await this.manager.loadEvents()
        await this.manager.loadCommands()
        await this.manager.loadInteractions()
        
        return super.login(token)
    }

    public static from(instance: Base) {
        return instance.client as NekoClient
    }
}