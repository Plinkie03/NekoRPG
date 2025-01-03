import { APIEmbedField, Base, Colors, User } from "discord.js"
import { BasicEmbed } from "./BasicEmbed.js"
import { Monster } from "../../monster/Monster.js"
import { Util } from "../Util.js"
import { Item } from "../../resource/Item.js"
import { Stats } from "../../entity/EntityBaseStats.js"
import { Game } from "../Game.js"
import { Rewards } from "../Rewards.js"

export class MonsterEmbed {
    private constructor() { }
    public static async from(i: Base, to: User, monster: Monster) {
        const embed = BasicEmbed.from(i, to, Colors.Aqua)
            .setTitle(monster.data.name)
            .setThumbnail(Util.getEmojiUrl(monster.data.emoji))

        const fields = new Array<Omit<APIEmbedField, "inline">>()

        fields.push({
            name: "ID",
            value: monster.id.toString()
        }, {
            name: "Level",
            value: Util.formatInt(monster.level)
        })

        if (monster.data.description) {
            fields.push({
                name: "Description",
                value: monster.data.description
            })
        }

        if (monster.data.spells?.length) {
            fields.push({
                name: "Spells",
                value: monster.data.spells.map(
                    x => x.simpleName
                ).join("\n")
            })
        }

        const foundIn = Game.Zones.filter(x => x.monsters?.some(x => x.id === monster.id))
        if (foundIn.size) {
            fields.push({
                name: `Found At`,
                value: foundIn.map(x => Util.addPoint(x.simpleName)).join("\n")
            })
        }

        fields.push({
            name: "Rewards",
            value: (await Rewards.give({ rewards: monster.data.rewards })).join("\n")
        })

        for (const [ statName, statValue ] of Object.entries(monster.baseStats.get())) {
            if (!statValue)
                continue

            fields.push({
                name: Util.camelToTitle(statName),
                value: Item.formatStatValue(statName as keyof Stats, statValue)
            })
        }

        embed.addFields(fields.map(x => ({
            ...x,
            inline: true
        })))

        return embed
    }
}