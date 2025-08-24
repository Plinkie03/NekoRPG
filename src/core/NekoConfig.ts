import { config } from 'dotenv'
import { env } from 'process'

config()

export class NekoConfig {
	private constructor() {}

	public static get token() {
		return env.BOT_TOKEN
	}
}
