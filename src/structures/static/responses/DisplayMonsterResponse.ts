import { ButtonInteraction, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { Player } from "../../player/Player.js"
import { Item } from "../../resource/Item.js"
import { ItemEmbed } from "../embeds/ItemEmbed.js"
import craft from "../../../interactions/button/info/item/craft.js"
import bulkCraft from "../../../interactions/button/info/item/bulkCraft.js"
import { Util } from "../Util.js"
import { Monster } from "../../monster/Monster.js"
import { MonsterEmbed } from "../embeds/MonsterEmbed.js"
import retry from "../../../interactions/button/fight/retry.js"

export class DisplayMonsterResponse {
    private constructor() { }

    public static async from(input: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player, monster: Monster) {
        const embed = await MonsterEmbed.from(input, input.user, monster)

        const rows = new Array<ActionRowBuilder<ButtonBuilder>>()

        if (player.zone.monsters?.some(x => x.id === monster.id)) {
            rows.push(
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder({
                            custom_id: retry.id(input.user, monster),
                            label: "Fight",
                            style: ButtonStyle.Primary
                        })
                    )
            )
        }

        await Util.reply(input, {
            ephemeral: true,
            embeds: [embed],
            components: rows
        })

        return true
    }
}