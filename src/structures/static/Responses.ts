import { ActionRowBuilder, AutocompleteInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Colors } from "discord.js";
import { GlobalExtrasData } from "../discord/Shared.js";
import { Embeds } from "./Embeds.js";
import manageInventoryPage, { ActionType } from "../../interactions/button/inventory/page.js";
import viewInventoryItem from "../../interactions/button/inventory/view.js";
import { emptyString } from "../../Constants.js";
import destroyInventoryItem from "../../interactions/button/inventory/destroy.js";
import lockInventoryItem from "../../interactions/button/inventory/lock.js";
import equipInventoryItem from "../../interactions/button/inventory/equip.js";

/**
 * TODO: Migrate each method to its own class in /responses/
 */
export class Responses {
    private constructor() {}

    public static async displayInventoryItem(input: ButtonInteraction<'cached'>, extras: GlobalExtrasData, uuid: string, page: number) {
        const invItem = extras.player.inventory.getItemByUUID(uuid)
        if (!invItem) {
            await input.reply({
                ephemeral: true,
                content: `That item doesn't exist :(`
            })
            return false
        }

        const embed = (await Embeds.inventoryItem(input, input.user, invItem))
            .setTitle(invItem.item.simpleName)
            .setThumbnail(invItem.item.image)

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    custom_id: manageInventoryPage.id(input.user, page, ActionType.Stay),
                    label: "Back",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: destroyInventoryItem.id(input.user, invItem.uuid, page),
                    label: "Destroy",
                    disabled: !invItem.destroyable,
                    style: ButtonStyle.Danger
                }),
                new ButtonBuilder({
                    custom_id: viewInventoryItem.id(input.user, invItem.uuid, page),
                    label: "Refresh",
                    emoji: "🔄",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: lockInventoryItem.id(input.user, invItem.uuid, page),
                    label: invItem.locked ? "Unlock" : "Lock",
                    style: ButtonStyle.Secondary
                })
            )

        if (invItem.item.equippable) {
            const reqs = invItem.equipped ? true : invItem.hasRequirements()

            actionRow.addComponents(
                new ButtonBuilder({
                    custom_id: equipInventoryItem.id(input.user, invItem.uuid, page),
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

    public static async displayInventory(input: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, extras: GlobalExtrasData, page: number) {
        const items = extras.player.inventory.page(page)

        if (!items.length) {
            await input.reply({
                ephemeral: true,
                content: `That page doesn't exist anymore :(`
            })
            return false
        }

        const embed = Embeds.basic(input, input.user, Colors.Aqua)
            .setDescription(
                items.map(
                    (x, i) => `[${x.index! + 1}] ${x.detailedName() + x.detailedAmount}`
                ).join("\n")
            )

        const movementRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder({
                    custom_id: manageInventoryPage.id(input.user, page, ActionType.Back),
                    label: "Back",
                    disabled: page === 1,
                    emoji: "◀️",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: manageInventoryPage.id(input.user, page, ActionType.Stay),
                    label: "Refresh",
                    emoji: "🔄",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: manageInventoryPage.id(input.user, page, ActionType.Next),
                    emoji: "▶️",
                    label: "Next",
                    disabled: extras.player.inventory.page(page + 1).length === 0,
                    style: ButtonStyle.Primary
                })
            ])
        
        const itemRows = new Array<ActionRowBuilder<ButtonBuilder>>(new ActionRowBuilder<ButtonBuilder>())

        for (let i = 0, len = items.length;i < len;i++) {
            const itm = items[i]
            const row = itemRows.at(-1)!
            const index = itm.index!

            row.addComponents(
                new ButtonBuilder({
                    custom_id: viewInventoryItem.id(input.user, itm.uuid, page),
                    label: (index + 1).toString(),
                    style: ButtonStyle.Secondary
                })
            )

            if (row.components.length === 5 && i + 1 !== len)
                itemRows.push(new ActionRowBuilder())
        }

        // @ts-ignore
        await input[input.isButton() ? "update" : "reply"]({
            embeds: [embed],
            components: [ 
                movementRow,
                ...itemRows
            ],
            content: emptyString,
            ephemeral: true
        })

        return true
    }
}