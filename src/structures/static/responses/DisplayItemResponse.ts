import { ButtonInteraction, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { Player } from "../../player/Player.js"
import { Item } from "../../resource/Item.js"
import { ItemEmbed } from "../embeds/ItemEmbed.js"
import craft from "../../../interactions/button/info/item/craft.js"
import bulkCraft from "../../../interactions/button/info/item/bulkCraft.js"
import { Util } from "../Util.js"

export class DisplayItemResponse {
    private constructor() {}

    public static async from(input: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player, item: Item) {
            const embed = await ItemEmbed.from(input, input.user, item)
    
            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder({
                        label: "Craft",
                        disabled: !item.isCraftable() || item.hasCraftRequirements(player) !== true,
                        style: ButtonStyle.Primary,
                        custom_id: craft.id(input.user, item)
                    }),
                    new ButtonBuilder({
                        label: "Bulk Craft",
                        disabled: !item.isCraftable() || item.hasCraftRequirements(player) !== true,
                        style: ButtonStyle.Primary,
                        custom_id: bulkCraft.id(input.user, item)
                    })
                )
    
            await Util.reply(input, {
                ephemeral: true,
                embeds: [embed],
                components: [row]
            })
    
            return true
        }
}