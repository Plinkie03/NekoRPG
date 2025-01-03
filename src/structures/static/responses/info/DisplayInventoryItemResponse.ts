import { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { emptyString } from "../../../../Constants.js"
import { GlobalExtrasData } from "../../../discord/Shared.js"
import { InventoryItemEmbed } from "../../embeds/InventoryItemEmbed.js"
import page, { ActionType } from "../../../../interactions/button/inventory/page.js"
import destroy from "../../../../interactions/button/inventory/destroy.js"
import view from "../../../../interactions/button/inventory/view.js"
import lock from "../../../../interactions/button/inventory/lock.js"
import equip from "../../../../interactions/button/inventory/equip.js"
import progress from "../../../../interactions/button/profile/progress.js"
import spells from "../../../../interactions/button/profile/spells.js"
import gear from "../../../../interactions/button/profile/gear.js"
import open from "../../../../interactions/button/inventory/open.js"
import { Nullable } from "../../../resource/Item.js"

export class DisplayInventoryItemResponse {
    private constructor() {}

    public static async from(input: ButtonInteraction<'cached'>, extras: GlobalExtrasData, uuid: string, backId: Nullable<typeof open.bindedId>) {
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
                        custom_id: backId?.(input.user, uuid) ?? page.id(input.user, invItem.pageNumber ?? 0, ActionType.Stay),
                        label: "Back",
                        disabled: !invItem.index,
                        style: ButtonStyle.Primary
                    }),
                    new ButtonBuilder({
                        custom_id: destroy.id(input.user, invItem.uuid),
                        label: "Destroy",
                        disabled: !invItem.destroyable,
                        style: ButtonStyle.Danger
                    }),
                    new ButtonBuilder({
                        custom_id: view.id(input.user, invItem.uuid),
                        label: "Refresh",
                        emoji: "🔄",
                        style: ButtonStyle.Primary
                    }),
                    new ButtonBuilder({
                        custom_id: lock.id(input.user, invItem.uuid),
                        label: invItem.locked ? "Unlock" : "Lock",
                        style: ButtonStyle.Secondary
                    })
                )
    
            if (invItem.item.equippable) {
                const reqs = invItem.equipped ? true : invItem.hasRequirements()
    
                actionRow.addComponents(
                    new ButtonBuilder({
                        custom_id: equip.id(input.user, invItem.uuid),
                        label: !invItem.equipped ? "Equip" : "Unequip",
                        disabled: reqs !== true || (invItem.item.isSpell() && extras.player.spells.isFull()),
                        style: ButtonStyle.Secondary
                    })
                )
            } else if (invItem.item.isLootbox()) {
                const reqs = invItem.equipped ? true : invItem.hasRequirements()

                actionRow.addComponents(
                    new ButtonBuilder({
                        custom_id: open.id(input.user, uuid),
                        label: "Open",
                        disabled: reqs !== true,
                        style: ButtonStyle.Success
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