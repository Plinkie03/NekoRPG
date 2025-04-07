import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Command } from '../../structures/discord/Command.js';
import test from '../../interactions/buttons/ping/test.js';

export default new Command({
    name: 'ping',
    description: "Shows the bot's ping",
    async execute(ctx) {
        await ctx.interaction.reply({
            content: 'Pong!',
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder({
                            custom_id: test.id(),
                            label: 'Test',
                            style: ButtonStyle.Success,
                        }),
                    ),
            ],
        });

        return true;
    },
});