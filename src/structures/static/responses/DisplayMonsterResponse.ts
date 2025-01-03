import { ButtonInteraction, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { Player } from "../../player/Player.js"
import { Item } from "../../resource/Item.js"
import { ItemEmbed } from "../embeds/ItemEmbed.js"
import craft from "../../../interactions/button/info/item/craft.js"
import bulkCraft from "../../../interactions/button/info/item/bulkCraft.js"
import { Util } from "../Util.js"
import { Monster } from "../../monster/Monster.js"
import { MonsterEmbed } from "../embeds/MonsterEmbed.js"

export class DisplayMonsterResponse {
    private constructor() {}

    public static async from(input: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player, monster: Monster) {
            const embed = await MonsterEmbed.from(input, input.user, monster)
    
            await Util.reply(input, {
                ephemeral: true,
                embeds: [embed]
            })
    
            return true
        }
}