import { Client, GatewayIntentBits } from 'discord.js';
import { Config } from '../structures/util/Config.js';
import { NekoCommands } from './NekoCommands.js';
import { NekoEvents } from './NekoEvents.js';
import { NekoDatabase } from './NekoDatabase.js';
import { NekoInteractions } from './NekoInteractions.js';

export class NekoClient extends Client<true> {
    public readonly commands = new NekoCommands(this);
    public readonly events = new NekoEvents(this);
    public readonly interactions = new NekoInteractions(this);

    public constructor() {
        super({
            intents: GatewayIntentBits.Guilds,
        });
    };

    public async login(): Promise<string> {
        await this.commands.load();
        await this.events.load();
        await this.interactions.load();
        await this.db.$connect();

        return super.login(Config.token);
    }

    public get db() {
        return NekoDatabase;
    };
};