import { Command } from '../../../structures/discord/Command.js';
import { DiscordEvent } from '../../../structures/discord/DiscordEvent.js';

export default new DiscordEvent({
    listener: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.inCachedGuild() || !interaction.isAutocomplete()) {
            return;
        }

        await Command.handleAutocomplete(this, interaction);
    },
});