import { Command } from "../../structures/discord/Command.js";
import { DiscordEventHandler } from "../../structures/discord/DiscordEventHandler.js";

export default new DiscordEventHandler({
    name: "interactionCreate",
    listener: async function (i) {
        if (!i.inCachedGuild() || !i.isAutocomplete()) return
        await Command.handleAutocomplete(i)
    }
})