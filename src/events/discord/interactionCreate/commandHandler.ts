import { Command } from "../../../structures/discord/Command.js";
import { DiscordEvent } from "../../../structures/discord/DiscordEvent.js";

export default new DiscordEvent({
    listener: "interactionCreate",
    async execute(interaction) {
        if (!interaction.inCachedGuild() || !interaction.isChatInputCommand())
            return

        await Command.handle(this, interaction)
    },
})