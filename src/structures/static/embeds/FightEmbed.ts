import { Base, User, Colors } from "discord.js"
import { Action } from "../../battle/actions/Action.js"
import { Fight } from "../../battle/Fight.js"
import { Monster } from "../../monster/Monster.js"
import { Util } from "../Util.js"
import { BasicEmbed } from "./BasicEmbed.js"

export class FightEmbed {
    private constructor() {}

    public static from(i: Base, user: User, fight: Fight, mob?: Monster) {
        const isWinner = fight.getWinnerTeam()?.some(x => x.id === user.id) ?? null
        const logs = fight.lastLogs

        const embed = BasicEmbed.from(i, user, isWinner === true ? Colors.Green : isWinner === false ? Colors.Red : Colors.Blue)
            .setThumbnail(Util.getEmojiUrl(mob?.data.emoji) ?? null)
            .setDescription(logs.map((x, i) => `## Round ${Util.formatInt(fight.round - (logs.length - i) + 1)}\n${Action.format(x)}`).join("\n"))

        if (isWinner === null) {
            for (let i = 0, len = fight.teams.length; i < len; i++) {
                const team = fight.teams[i]

                embed.addFields({
                    inline: false,
                    name: `Team ${i + 1}`,
                    value: team.map(
                        x => `- ${x.displayName}${x.moddedStats.ailments.length ? ` ${x.moddedStats.ailments.map(x => x.effect.emoji).filter(Boolean).join(" ")}` : ""}: ${x.isDead() ? "☠️" : `${Util.formatInt(x.hp)} / ${Util.formatInt(x.moddedStats.maxHealth)} (${Util.formatFloat(x.hp / x.moddedStats.maxHealth * 100)}%)`}`
                    ).join("\n")
                })
            }
        } else if (fight.rewards.size) {
            for (const [player, rewards] of fight.rewards) {
                embed.addFields({
                    inline: true,
                    value: rewards.map(Util.addPoint).join("\n"),
                    name: fight.rewards.size === 1 ? "Rewards" : `${player.displayName} - Rewards`
                })
            }
        }

        return embed
    }
}