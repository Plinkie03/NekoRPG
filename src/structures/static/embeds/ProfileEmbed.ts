import { APIEmbedField, ButtonInteraction, ChatInputCommandInteraction, Colors } from "discord.js";
import { Player } from "../../player/Player.js";
import { BasicEmbed } from "./BasicEmbed.js";
import { Util } from "../Util.js";
import { GearType, Item } from "../../resource/Item.js";
import { Stats } from "../../entity/EntityBaseStats.js";
import { SkillType } from "../../player/PlayerSkills.js";

export class ProfileEmbed {
    private constructor() { }

    public static fromProgress(i: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player) {
        const embed = BasicEmbed.from(i, i.user, Colors.Aqua)
            .setTitle("Progress")
            .setThumbnail(i.user.displayAvatarURL())
            .addFields({
                name: "Progress",
                value: `Level: ${Util.formatInt(player.level)}\nExp: ${Util.formatInt(player.data.xp)} / ${Util.formatInt(player.getReqXp())} (${Util.formatFloat(player.data.xp / player.getReqXp())}%)`
            }, {
                name: "Economy",
                value: `Money: ${Util.formatInt(player.data.money)}\nGems: ${Util.formatInt(player.data.gems)}`
            })

        return embed
    }

    public static fromStats(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player) {
        const embed = BasicEmbed.from(i, i.user, Colors.Aqua)
            .setTitle("Stats")
            .setThumbnail(i.user.displayAvatarURL())

        for (const [statName, statValue] of Object.entries(player.baseStats.get())) {
            embed.addFields({
                inline: true,
                name: Util.camelToTitle(statName),
                value: `${Item.isPercentualStat(statName as keyof Stats) ? `${Util.formatFloat(statValue)}%` : `${Util.formatInt(statValue)}`}`
            })
        }

        return embed
    }

    public static fromSkills(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player) {
        const embed = BasicEmbed.from(i, i.user, Colors.Aqua)
            .setTitle("Skills")
            .setThumbnail(i.user.displayAvatarURL())

        for (const skill of player.skills.toArray()) {
            embed.addFields({
                name: Util.camelToTitle(SkillType[skill.type]),
                value: `Level: ${Util.formatInt(skill.level)}\nExp: ${Util.formatInt(skill.xp)} / ${Util.formatInt(skill.reqXp)} (${Util.formatFloat(skill.xp / skill.reqXp)}%)\nMultiplier: ${Util.formatFloat(skill.multiplier)}x`,
                inline: true
            })
        }

        return embed
    }

    public static fromGear(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player) {
        const gear = player.gear.toArray()

        const embed = BasicEmbed.from(i, i.user, Colors.Aqua)
            .setTitle("Gear")
            .setThumbnail(i.user.displayAvatarURL())
            .setDescription(gear.length === 0 && "No gear :(" || null)

        for (const item of gear) {
            embed.addFields({
                inline: true,
                name: GearType[item.item.gearType!],
                value: item.detailedName(true)
            })
        }

        return embed
    }

    public static fromSpells(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player) {
        const spells = player.spells.equipped

        const embed = BasicEmbed.from(i, i.user, Colors.Aqua)
            .setTitle("Spells")
            .setThumbnail(i.user.displayAvatarURL())
            .setDescription(spells.map(x => x.detailedName(true)).join("\n") || "No spells :(")

        return embed
    }
}