import { ButtonInteraction, ChatInputCommandInteraction, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { emptyString } from "../../../../Constants.js"
import { GlobalExtrasData } from "../../../discord/Shared.js"
import { BasicEmbed } from "../../embeds/BasicEmbed.js"
import page, { ActionType } from "../../../../interactions/button/inventory/page.js"
import view from "../../../../interactions/button/inventory/view.js"
import { Util } from "../../Util.js"

export class DisplayInventoryResponse {
    private constructor() {}

    public static async from(input: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, extras: GlobalExtrasData, pg: number) {
        const items = extras.player.inventory.page(pg)

        if (!items.length) {
            await input.reply({
                ephemeral: true,
                content: `There are no items in the inventory...`
            })
            return false
        }

        const embed = BasicEmbed.from(input, input.user, Colors.Aqua)
            .setDescription(
                items.map(
                    (x, i) => `[${x.index! + 1}] ${x.detailedName() + x.detailedAmount}`
                ).join("\n")
            )

        const movementRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder({
                    custom_id: page.id(input.user, pg, ActionType.Back),
                    label: "Back",
                    disabled: pg === 1,
                    emoji: "◀️",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: page.id(input.user, pg, ActionType.Stay),
                    label: "Refresh",
                    emoji: "🔄",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: page.id(input.user, pg, ActionType.Next),
                    emoji: "▶️",
                    label: "Next",
                    disabled: pg === extras.player.inventory.pageCount,
                    style: ButtonStyle.Primary
                })
            ])

        const itemRows = new Array<ActionRowBuilder<ButtonBuilder>>(new ActionRowBuilder<ButtonBuilder>())

        for (let i = 0, len = items.length; i < len; i++) {
            const itm = items[i]
            const row = itemRows.at(-1)!
            const index = itm.index!

            row.addComponents(
                new ButtonBuilder({
                    custom_id: view.id(input.user, itm.uuid),
                    label: (index + 1).toString(),
                    style: ButtonStyle.Secondary
                })
            )

            if (row.components.length === 5 && i + 1 !== len)
                itemRows.push(new ActionRowBuilder())
        }

        await Util.reply(input, {
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