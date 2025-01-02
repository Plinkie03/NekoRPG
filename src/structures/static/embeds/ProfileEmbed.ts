import { APIEmbedField, ButtonInteraction, ChatInputCommandInteraction, Colors } from "discord.js";
import { Player } from "../../player/Player.js";
import { BasicEmbed } from "./BasicEmbed.js";
import { Util } from "../Util.js";

export class ProfileEmbed {
    private constructor() { }

    public static from(i: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player) {
        const embed = BasicEmbed.from(i, i.user, Colors.Aqua)
            .setTitle("Profile")
            .setThumbnail(i.user.displayAvatarURL())

        const fields = new Array<Omit<APIEmbedField, "inline">>()

        fields.push(...[
            {
                name: "Progress",
                value: `Level: ${Util.formatInt(player.level)}\nExp: ${Util.formatInt(player.data.xp)} / ${Util.formatInt(player.getReqXp())} (${Util.formatFloat(player.data.xp / player.getReqXp())}%)`
            },
            {
                name: "Economy",
                value: `Money: ${Util.formatInt(player.data.money)}\nGems: ${Util.formatInt(player.data.gems)}`
            },
            {
                name: "Gear",
                value: player.gear.toArray().map(
                    x => x.detailedName(true)
                ).join("\n") || "None"
            },
            {
                name: "Spells",
                value: player.spells.equipped.map(
                    x => x.detailedName(true)
                ).join("\n") || "None"
            }
        ])

        for (const skill of player.skills.toArray()) {
            fields.push({
                name: Util.camelToTitle(skill.name),
                value: `Level: ${Util.formatInt(skill.level)}\nExp: ${Util.formatInt(skill.xp)} / ${Util.formatInt(skill.reqXp)} (${Util.formatFloat(skill.xp / skill.reqXp)}%)\nMultiplier: ${Util.formatFloat(player.skills.getMultiplier(skill.name))}x`
            })
        }

        embed.addFields(fields.map(x => ({
            ...x,
            inline: true
        })))

        return embed
    }
}