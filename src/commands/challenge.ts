import { ButtonStyle, Colors } from "discord.js";
import { Command } from "../structures/discord/Command.js";
import { ArgType } from "../structures/discord/Shared.js";
import { BasicEmbed } from "../structures/static/embeds/BasicEmbed.js";
import { Responses } from "../structures/static/Responses.js";
import { FightEntityResponse } from "../structures/static/responses/FightEntityResponse.js";
import { Util } from "../structures/static/Util.js";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import accept from "../interactions/button/fight/accept.js";

export default new Command({
    name: "challenge",
    description: "Challenge a player",
    disabled: true,
    args: [
        {
            name: "player",
            description: "The player to challenge",
            type: ArgType.Player,
            required: true
        }
    ],
    async execute(payload) {
        if (payload.args[0].id === payload.extras.player.id) {
            await Util.reply(payload.instance, {
                content: `Really, babe?`,
                ephemeral: true
            })
            return false
        }


        const embed = BasicEmbed.from(payload.instance, payload.instance.user, Colors.Blue)
            .setTitle("Duel")
            .setDescription(`${payload.extras.player.displayName} is challenging ${payload.args[0].displayName} into a fight! Will they accept?`)

        await Util.reply(payload.instance, {
            embeds: [
                embed
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder({
                            style: ButtonStyle.Success,
                            label: "Accept",
                            custom_id: accept.id(payload.args[0], payload.extras.player)
                        })
                    )
            ]
        })
        
        return true
    },
})