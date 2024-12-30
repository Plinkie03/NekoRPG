import { setTimeout } from "timers/promises";
import { Command } from "../../structures/discord/Command.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import button from "../../interactions/test/button.js";

enum Types {
    One,
    Two
}

export default new Command({
    name: "ping",
    description: "Hello",
    args: [
        {
            name: "xd",
            description: "random",
            type: ArgType.Enum,
            enum: Types
        }
    ] as const,
    async execute(input, args, extras) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder({
                custom_id: button.id(ArgType.Enum),
                label: "Hi",
                style: ButtonStyle.Primary
            })
        ])

        await input.reply({
            content: "hello",
            components: [ row ]
        })

        return Promise.resolve(true)
    },
})