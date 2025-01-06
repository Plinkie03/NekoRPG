import { ButtonInteraction, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import retry from "../../../interactions/button/fight/retry.js"
import { Fight } from "../../battle/Fight.js"
import { Monster } from "../../monster/Monster.js"
import { Player } from "../../player/Player.js"
import { FightEmbed } from "../embeds/FightEmbed.js"
import { Util } from "../Util.js"
import { Entity } from "../../entity/Entity.js"
import { NekoClient } from "../../../core/NekoClient.js"

export class FightEntityResponse {
    private constructor() { }

    public static async from(input: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player, other: Entity) {
        const client = NekoClient.from(input)

        if (other instanceof Player && !client.manager.lock(input, other.id)) {
            return false
        }

        const fight = new Fight([
            [player.clone()],
            [other.clone()]
        ])

        function advance(finish = false) {
            const row = new ActionRowBuilder<ButtonBuilder>()

            if (finish && other instanceof Monster) {
                row.addComponents(
                    new ButtonBuilder({
                        emoji: "🔄",
                        custom_id: retry.id(input.user, other),
                        label: "Retry",
                        style: ButtonStyle.Primary
                    })
                )
            }

            return Util.reply(input, {
                ephemeral: true,
                embeds: [
                    FightEmbed.from(input, input.user, fight, other)
                ],
                components: finish && row.components.length ? [row] : []
            })
        }

        fight.on("round", advance.bind(null, false))

        await fight.start()

        await advance(true)

        client.manager.unlock(other.id)

        return true
    }
}