import { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { emptyString } from "../../../Constants.js"
import { GlobalExtrasData } from "../../discord/Shared.js"
import { InventoryItemEmbed } from "../embeds/InventoryItemEmbed.js"
import page, { ActionType } from "../../../interactions/button/inventory/page.js"
import destroy from "../../../interactions/button/inventory/destroy.js"
import view from "../../../interactions/button/inventory/view.js"
import lock from "../../../interactions/button/inventory/lock.js"
import equip from "../../../interactions/button/inventory/equip.js"

export class DisplayInventoryItemResponse {
    private constructor() {}

    public static async from(input: ButtonInteraction<'cached'>, extras: GlobalExtrasData, uuid: string, pg: number) {
            const invItem = extras.player.inventory.getItemByUUID(uuid)
            if (!invItem) {
                await input.reply({
                    ephemeral: true,
                    content: `That item doesn't exist :(`
                })
                return false
            }
    
            const embed = (await InventoryItemEmbed.from(input, input.user, invItem))
                .setTitle(invItem.item.simpleName)
                .setThumbnail(invItem.item.image)
    
            const actionRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder({
                        custom_id: page.id(input.user, pg, ActionType.Stay),
                        label: "Back",
                        style: ButtonStyle.Primary
                    }),
                    new ButtonBuilder({
                        custom_id: destroy.id(input.user, invItem.uuid, pg),
                        label: "Destroy",
                        disabled: !invItem.destroyable,
                        style: ButtonStyle.Danger
                    }),
                    new ButtonBuilder({
                        custom_id: view.id(input.user, invItem.uuid, pg),
                        label: "Refresh",
                        emoji: "🔄",
                        style: ButtonStyle.Primary
                    }),
                    new ButtonBuilder({
                        custom_id: lock.id(input.user, invItem.uuid, pg),
                        label: invItem.locked ? "Unlock" : "Lock",
                        style: ButtonStyle.Secondary
                    })
                )
    
            if (invItem.item.equippable) {
                const reqs = invItem.equipped ? true : invItem.hasRequirements()
    
                actionRow.addComponents(
                    new ButtonBuilder({
                        custom_id: equip.id(input.user, invItem.uuid, pg),
                        label: !invItem.equipped ? "Equip" : "Unequip",
                        disabled: reqs !== true,
                        style: ButtonStyle.Secondary
                    })
                )
            }
    
            await input.update({
                embeds: [embed],
                content: emptyString,
                components: [actionRow] 
            })
    
            return true
        }
}