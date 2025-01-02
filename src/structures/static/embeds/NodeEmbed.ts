import { APIEmbedField, Base, Colors, EmbedBuilder, User } from "discord.js";
import { Node } from "../../resource/node/Node.js";
import { BasicEmbed } from "./BasicEmbed.js";
import { Util } from "../Util.js";
import { Rewards } from "../Rewards.js";

export class NodeEmbed {
    private constructor() {}

    public static async from(i: Base, to: User, node: Node) {
        const embed = BasicEmbed.from(i, to, Colors.Aqua)
            .setTitle(node.name)
            .setThumbnail(node.image)
        
        const fields = new Array<Omit<APIEmbedField, "inline">>()
            
        fields.push({
            name: "ID",
            value: node.id.toString()
        }, {
            name: "Type",
            value: Util.camelToTitle(node.type)
        })

        if (node.data.description) {
            fields.push({
                name: "Description",
                value: node.data.description
            })
        }

        const reqs = node.hasRequirements()

        if (reqs !== true) {
            fields.push({
                name: "Requirements",
                value: reqs.join("\n")
            })
        }

        for (const resource of node.resources) {
            const rewards = await Rewards.give({ rewards: resource.rewards })
            fields.push({
                name: `Resource - ${resource.item.simpleName}`,
                value: [
                    `Quantity: ${resource.amount ?? 1}`,
                    `Hardness: ${Util.formatInt(resource.hardness)}`,
                    `Chance: ${Util.formatFloat(resource.chance ?? 100)}%`,
                    `Rewards:`,
                    ...rewards.map(Util.addPoint)
                ].join("\n")
            })
        }

        embed.addFields(fields.map(x => ({
            ...x,
            inline: true
        })))

        return embed
    }
}