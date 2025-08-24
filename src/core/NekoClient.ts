import { NekoConfig, NekoDatabase, NekoManager, NekoResources } from '@nekorpg'
import { Client, GatewayIntentBits, Partials } from 'discord.js'

export class NekoClient extends Client<true> {
	public readonly manager = new NekoManager(this)

	public constructor() {
		super({
			intents: GatewayIntentBits.Guilds,
			partials: [
				Partials.Channel,
				Partials.GuildMember,
				Partials.GuildScheduledEvent,
				Partials.Message,
				Partials.Reaction,
				Partials.SoundboardSound,
				Partials.ThreadMember,
				Partials.User,
			],
		})
	}

	public async login(): Promise<string> {
		await NekoResources.init()
		await NekoDatabase.$connect()
		await this.manager.interactions.load()
		await this.manager.commands.load()
		await this.manager.events.load()
		return super.login(NekoConfig.token)
	}
}
