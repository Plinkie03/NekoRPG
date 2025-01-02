import { Base, User, Colors, APIEmbedField } from "discord.js"
import { emptyString } from "../../../Constants.js"
import { NekoClient } from "../../../core/NekoClient.js"
import { Item, ItemType, GearType } from "../../resource/Item.js"
import { Rewards } from "../Rewards.js"
import { Util } from "../Util.js"
import { BasicEmbed } from "./BasicEmbed.js"

export class ItemEmbed {
    private constructor() {}

    public static async from(i: Base, to: User, item: Item, stats = item.getStats()) {
        const client = NekoClient.from(i)

        const embed = BasicEmbed.from(i, to, Colors.Aqua)
            .setTitle(item.simpleName)
            .setThumbnail(item.image)

        const fields = new Array<Omit<APIEmbedField, "inline">>()

        fields.push({
            name: "ID",
            value: item.id.toString()
        }, {
            name: "Type",
            value: `${ItemType[item.type]}${item.isGear() ? ` [${GearType[item.gearType!]}]` : ""}`
        }, {
            name: "Price",
            value: item.price.toString()
        })

        if (item.data.description) {
            fields.push({
                name: "Description",
                value: item.data.description
            })
        }

        const reqs = item.hasRequirements()
        const craftReqs = item.hasCraftRequirements()

        if (reqs !== true) {
            fields.push({
                name: "Equip Requirements",
                value: reqs.join("\n")
            })
        }

        if (craftReqs !== true) {
            fields.push({
                name: "Craft Recipe",
                value: craftReqs.join("\n"),
            }, {
                name: "Craft Chance",
                value: `${item.data.craft!.chance ?? 100}% (${Util.plural("unit", item.data.craft!.amount ?? 1)})`
            }, {
                name: "Craft Rewards",
                value: (await Rewards.give({ rewards: item.data.craft!.rewards })).join("\n")
            })
        }

        for (const stat of Util.objectKeys(stats)) {
            const value = stats[stat]
            if (value === 0) continue
            fields.push({
                name: Util.camelToTitle(stat),
                value: (Item.isPercentualStat(stat) ? Util.formatFloat(value) : Util.formatInt(value)) + (Item.isPercentualStat(stat) ? "%" : emptyString)
            })
        }

        embed.setFields(fields.map(x => ({
            ...x,
            inline: true
        })))

        return embed
    }
}