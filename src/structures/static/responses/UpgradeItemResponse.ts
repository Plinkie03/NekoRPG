import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Colors } from "discord.js";
import { Player } from "../../player/Player.js";
import { PlayerInventoryItem } from "../../player/PlayerInventoryItem.js";
import { LootboxOpenResponseType } from "../../resource/Item.js";
import { Util } from "../Util.js";
import { BasicEmbed } from "../embeds/BasicEmbed.js";
import view from "../../../interactions/button/inventory/view.js";
import { DisplayInventoryItemResponse } from "./info/DisplayInventoryItemResponse.js";

export class UpgradeItemResponse {
    private constructor() {}

    public static async from(i: ButtonInteraction<'cached'>, player: Player, uuid: string) {
        const invItem = player.inventory.getItemByUUID(uuid)
        
        if (!invItem) {
            await Util.reply(i, {
                ephemeral: true,
                content: `That item doesn't exist :(`
            })
            return false
        }

        const result = await invItem.upgrade()

        if (result === true) {
            await DisplayInventoryItemResponse.from(i, player, uuid, null)
        } else {
            const embed = BasicEmbed.from(i, i.user, Colors.Red)
                .setTitle(result === null ? `Not upgradable` : `Missing Requirements`)
                .setDescription(
                    result === null ? `This item cannot be upgraded...` : `You're missing the following requirements to upgrade this item:\n${result.map(Util.addPoint).join("\n")}`
                )

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
        }

        return result === true
    }
}