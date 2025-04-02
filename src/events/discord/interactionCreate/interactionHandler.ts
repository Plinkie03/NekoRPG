import { DiscordEvent } from "../../../structures/discord/DiscordEvent.js";
import { Interaction } from "../../../structures/discord/Interaction.js";

export default new DiscordEvent({
    listener: "interactionCreate",
    async execute(interaction) {
        if (!interaction.inCachedGuild() || !interaction.isMessageComponent())
            return

        await Interaction.handle(this, interaction)
    },
})