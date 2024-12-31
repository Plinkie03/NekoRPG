import { APIEmbedField, Base, ColorResolvable, Colors, EmbedBuilder, User } from "discord.js"
import { NekoClient } from "../../core/NekoClient.js"
import { GearType, Item, ItemType } from "../resource/Item.js"
import { PlayerInventoryItem } from "../player/PlayerInventoryItem.js"
import { Util } from "./Util.js"
import { emptyString } from "../../Constants.js"
import { Rewards } from "./Rewards.js"

/**
 * Some pre-built embeds
 */
export class Embeds {
    private constructor() { }

    public static basic(i: Base, to: User, color: ColorResolvable) {
        const client = NekoClient.from(i)

        const embed = new EmbedBuilder()
            .setAuthor({
                name: to.displayName,
                iconURL: to.displayAvatarURL()
            })
            .setColor(color)
            .setFooter({
                text: `❤ RPG Adventures with ${client.user.displayName}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp()

        return embed
    }

    public static async item(i: Base, to: User, item: Item, stats = item.getStats()) {
        const client = NekoClient.from(i)

        const embed = Embeds.basic(i, to, Colors.Aqua)
            .setTitle(item.simpleName)
            .setThumbnail(item.emoji)

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
                value: (await Rewards.give(item.data.craft!.rewards)).join("\n")
            })
        }
        
        for (const stat of Util.objectKeys(stats)) {
            const value = stats[stat]
            if (value === 0) continue
            fields.push({
                name: Util.camelToTitle(stat),
                value: value.toString() + (Item.isPercentualStat(stat) ? "%" : emptyString)
            })
        }

        embed.setFields(fields.map(x => ({
            ...x,
            inline: true
        })))

        return embed
    }

    public static async inventoryItem(i: Base, to: User, invItem: PlayerInventoryItem) {
        const client = NekoClient.from(i)

        const embed = await Embeds.item(i, to, invItem.item, invItem.getStats())

        return embed
    }
}