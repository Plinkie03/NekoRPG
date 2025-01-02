import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Invite } from "discord.js";
import { Player } from "../../player/Player.js";
import { ProfileEmbed } from "../embeds/ProfileEmbed.js";
import progress from "../../../interactions/button/profile/progress.js";
import view from "../../../interactions/button/inventory/view.js";
import stats from "../../../interactions/button/profile/stats.js";
import gear from "../../../interactions/button/profile/gear.js";
import { Util } from "../Util.js";
import spells from "../../../interactions/button/profile/spells.js";
import skills from "../../../interactions/button/profile/skills.js";

export class DisplayProfileResponse {
    private constructor() { }

    public static components(i: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player, fn: typeof gear.bindedId) {
        const id = fn(i.user)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    custom_id: progress.id(i.user),
                    label: "Progress",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: stats.id(i.user),
                    label: "Stats",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: skills.id(i.user),
                    label: "Skills",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: gear.id(i.user),
                    label: "Gear",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: spells.id(i.user),
                    label: "Spells",
                    style: ButtonStyle.Primary
                })
            )

        row.components.forEach(
            x => x.setDisabled(id === Reflect.get(x.data, "custom_id"))
        )

        return row
    }

    public static async fromGear(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player) {
        const row = DisplayProfileResponse.components(i, player, gear.bindedId)

        await Util.reply(i, {
            ephemeral: true,
            embeds: [
                ProfileEmbed.fromGear(i, player)
            ],
            components: [
                row,
                ...Util.createActionRows(
                    player.gear.toArray(),
                    invItem => new ButtonBuilder({
                        custom_id: view.id(i.user, invItem.uuid, -1),
                        label: invItem.detailedName(false),
                        emoji: invItem.item.emoji ?? undefined,
                        style: ButtonStyle.Primary
                    })
                )
            ]
        })

        return true
    }

    public static async fromSpells(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player) {
        const row = DisplayProfileResponse.components(i, player, spells.bindedId)

        await Util.reply(i, {
            ephemeral: true,
            embeds: [
                ProfileEmbed.fromSpells(i, player)
            ],
            components: [
                row,
                ...Util.createActionRows(
                    player.spells.equipped,
                    invItem => new ButtonBuilder({
                        custom_id: view.id(i.user, invItem.uuid, -1),
                        label: invItem.detailedName(false),
                        emoji: invItem.item.emoji ?? undefined,
                        style: ButtonStyle.Primary
                    })
                )
            ]
        })

        return true
    }

    public static async fromStats(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player) {
        const row = DisplayProfileResponse.components(i, player, stats.bindedId)

        await Util.reply(i, {
            ephemeral: true,
            embeds: [
                ProfileEmbed.fromStats(i, player)
            ],
            components: [
                row
            ]
        })

        return true
    }

    public static async fromSkills(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player) {
        const row = DisplayProfileResponse.components(i, player, skills.bindedId)

        await Util.reply(i, {
            ephemeral: true,
            embeds: [
                ProfileEmbed.fromSkills(i, player)
            ],
            components: [
                row
            ]
        })

        return true
    }

    public static async fromProgress(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player) {
        const row = DisplayProfileResponse.components(i, player, progress.bindedId)

        await Util.reply(i, {
            ephemeral: true,
            embeds: [
                ProfileEmbed.fromProgress(i, player)
            ],
            components: [
                row
            ]
        })

        return true
    }
}