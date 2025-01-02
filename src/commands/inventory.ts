import { ActionRowBuilder, ButtonBuilder, Colors } from "discord.js";
import SlimeBall from "../resources/item/material/other/SlimeBall.js";
import { Command } from "../structures/discord/Command.js";
import { ArgType } from "../structures/discord/Shared.js";
import { Responses } from "../structures/static/Responses.js";
import IronSword from "../resources/item/gear/weapon/sword/IronSword.js";
import { DisplayInventoryResponse } from "../structures/static/responses/DisplayInventoryResponse.js";

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
        return DisplayInventoryResponse.from(payload.instance, payload.extras, payload.args[0])
    },
})