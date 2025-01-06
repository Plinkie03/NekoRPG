import { DiscordEventHandler } from "../../structures/discord/DiscordEventHandler.js";
import { Logger } from "../../structures/static/Logger.js";
import { Util } from "../../structures/static/Util.js";

export default new DiscordEventHandler({
    name: "ready",
    once: true,
    listener: function () {
        Logger.info(`Ready on client ${this.user.displayName}`)
    }
})