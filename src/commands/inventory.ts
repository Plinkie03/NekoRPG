import { ActionRowBuilder, ButtonBuilder, Colors } from "discord.js";
import SlimeBall from "../resources/item/material/other/SlimeBall.js";
import { Command } from "../structures/discord/Command.js";
import { ArgType } from "../structures/discord/Shared.js";
import { Embeds } from "../structures/static/Embeds.js";
import { Responses } from "../structures/static/Responses.js";
import IronSword from "../resources/item/gear/weapon/sword/IronSword.js";

export default new Command({
    name: "inventory",
    description: "Displays your inventory",
    args: [
        {
            name: "page",
            description: "The page number",
            type: ArgType.Integer,
            default: async i => 1
        }
    ],
    async execute(payload) {
        return Responses.displayInventory(payload.instance, payload.extras, payload.args[0])
    },
})