import { Base, User, Colors, APIEmbedField } from "discord.js"
import { emptyString } from "../../../Constants.js"
import { NekoClient } from "../../../core/NekoClient.js"
import { Item, ItemType, GearType } from "../../resource/Item.js"
import { Rewards } from "../Rewards.js"
import { Util } from "../Util.js"
import { BasicEmbed } from "./BasicEmbed.js"
import { PlayerInventoryItem } from "../../player/PlayerInventoryItem.js"

export class ItemEmbed {
    private constructor() {}

    public static async from(i: Base, to: User, itm: Item | PlayerInventoryItem) {
        const item = itm instanceof PlayerInventoryItem ? itm.item : itm

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

        const desc = itm instanceof PlayerInventoryItem && itm.spell ? itm.spell.info() : item.data.description

        if (desc) {
            fields.push({
                name: "Description",
                value: desc 
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

        if (itm instanceof PlayerInventoryItem && itm.passives.length !== 0) {
            fields.push({
                name: Util.plural("Passive", itm.passives.length, undefined, true),
                value: itm.passives.map(x => `**${x.simpleName}**: ${x.info()}${x.data.cooldown ? ` (CD: ${x.data.cooldown}R)` : ""}`).join("\n")
            })
        }

        const stats = itm.getStats()

        for (const stat of Util.objectKeys(stats)) {
            const value = stats[stat]
            if (value === 0) continue
            fields.push({
                name: Util.camelToTitle(stat),
                value: Item.formatStatValue(stat, value)
            })
        }

        embed.setFields(fields.map(x => ({
            ...x,
            inline: true
        })))

        return embed
    }
}