import { DiscordEventHandler } from "../../structures/discord/DiscordEventHandler.js";
import { Logger } from "../../structures/static/Logger.js";

export default new DiscordEventHandler({
    name: "ready",
    once: true,
    listener: async function () {
        await this.application.commands.set(this.manager.getJSONCommands())
        Logger.info(`Successfully posted commands to Discord`)
    }
})