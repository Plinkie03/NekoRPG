import { DiscordEvent } from "../../../structures/discord/DiscordEvent.js";

export default new DiscordEvent({
    listener: "ready",
    async execute(client) {
        await this.application.commands.set(this.commands.toJSON())
        console.log(`Successfully registered commands!`)
    }
})