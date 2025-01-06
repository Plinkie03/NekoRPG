import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Colors } from "discord.js";
import { Player } from "../../player/Player.js";
import { PlayerInventoryItem } from "../../player/PlayerInventoryItem.js";
import { LootboxOpenResponseType } from "../../resource/Item.js";
import { Util } from "../Util.js";
import { BasicEmbed } from "../embeds/BasicEmbed.js";
import view from "../../../interactions/button/inventory/view.js";

export class OpenLootboxResponse {
    private constructor() {}

    public static async from(i: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player, uuid: string, times: number) {
        const invItem = player.inventory.getItemByUUID(uuid)
        if (!invItem) {
            await Util.reply(i, {
                ephemeral: true,
                content: `That item doesn't exist :(`
            })
            return false
        }

        const result = await invItem.open(times)

        const embed = BasicEmbed.from(i, i.user, Colors.Red)

        if (result === false) {
            embed.setTitle("Missing Quantity")
                .setDescription(`You can't open ${invItem.item.simpleName} ${Util.plural("time", times)} because you're missing a few!`)
        } else {
            switch(result.type) {
                case LootboxOpenResponseType.Failed: {
                    embed.setTitle("No Loot")
                        .setDescription(`You opened ${invItem.item.simpleName} ${Util.plural("time", times)} but didn't get anything...`)
                    break
                }

                case LootboxOpenResponseType.MissingRequirements: {
                    embed.setTitle("Missing Requirements")
                        .setDescription(`You missing the following requirements:\n${result.errors.map(Util.addPoint).join("\n")}`)
                    break
                }

                case LootboxOpenResponseType.NotLootbox: {
                    embed.setTitle(`Not Lootbox`)
                        .setDescription(`This item isn't a lootbox :(`)
                    break
                }

                case LootboxOpenResponseType.Success: {
                    embed.setTitle("Success")
                        .setColor(Colors.Green)
                        .setDescription(`You opened ${invItem.item.simpleName} ${Util.plural("time", times)} and received the following:\n${result.rewards.map(Util.addPoint).join("\n")}`)
                    break
                }
            }
        }

        await Util.reply(i, {
            ephemeral: true,
            embeds: [embed],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder({
                            custom_id: view.id(i.user, invItem.uuid),
                            label: "Back",
                            disabled: !invItem.index,
                            style: ButtonStyle.Primary
                        })
                    )
            ]
        })

        return result !== false && result.type !== LootboxOpenResponseType.Failed
    }
}