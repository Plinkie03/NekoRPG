import { setTimeout } from "timers/promises";
import { Command } from "../../structures/discord/Command.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import button from "../../interactions/test/button.js";
import { Util } from "../../structures/static/Util.js";
import { Game } from "../../structures/static/Game.js";
import SlimeField from "../../resources/zone/SlimeField.js";

enum Types {
    One,
    Two
}

export default new Command({
    name: "ping",
    description: "Hello",
    args: [
        {
            name: "xd" as const,
            description: "random",
            type: ArgType.InventoryItem
        }
    ],
    async execute(input, args, extras) {
        await input.reply(SlimeField.emoji!)
        return Promise.resolve(true)
    },
})