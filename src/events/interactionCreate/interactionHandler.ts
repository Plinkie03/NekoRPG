import { Command } from "../../structures/discord/Command.js";
import { DiscordEventHandler } from "../../structures/discord/DiscordEventHandler.js";
import { DiscordInteractionHandler } from "../../structures/discord/DiscordInteractionHandler.js";

export default new DiscordEventHandler({
    name: "interactionCreate",
    listener: async function (i) {
        if (!i.inCachedGuild() || !("customId" in i)) return
        await DiscordInteractionHandler.handle(i)
    }
})