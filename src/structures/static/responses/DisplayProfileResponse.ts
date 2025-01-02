import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Invite } from "discord.js";
import { Player } from "../../player/Player.js";
import { ProfileEmbed } from "../embeds/ProfileEmbed.js";
import refresh from "../../../interactions/button/profile/refresh.js";
import view from "../../../interactions/button/inventory/view.js";

export class DisplayProfileResponse {
    private constructor() { }

    public static async from(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player) {
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    custom_id: refresh.id(i.user),
                    label: "Refresh",
                    emoji: "🔄",
                    style: ButtonStyle.Primary
                }),
            )

        const itemRows = new Array<ActionRowBuilder<ButtonBuilder>>(new ActionRowBuilder<ButtonBuilder>())
        const items = [ ...player.gear.toArray(), ...player.spells.equipped ]

        for (const invItem of items) {
            const row = itemRows.at(-1)!
            row.addComponents(
                new ButtonBuilder({
                    custom_id: view.id(i.user, invItem.uuid, -1),
                    label: invItem.detailedName(false),
                    emoji: invItem.item.emoji ?? undefined,
                    style: ButtonStyle.Primary
                })
            )

            if (row.components.length === 5)
                itemRows.push(new ActionRowBuilder())
        }

        await i[(i.isButton() ? "update" : "reply") as "reply"]({
            ephemeral: true,
            embeds: [
                ProfileEmbed.from(i, player)
            ],
            components: [
                row,
                ...itemRows.filter(x => !!x.components.length)
            ]
        })

        return true
    }
}