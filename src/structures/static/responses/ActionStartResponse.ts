import { ButtonInteraction, ChatInputCommandInteraction, Colors } from "discord.js"
import { Node, NodeStartCollectResponseType } from "../../resource/node/Node.js"
import { Player } from "../../player/Player.js"
import { BasicEmbed } from "../embeds/BasicEmbed.js"
import { Util } from "../Util.js"

export class ActionStartResponse {
    public static async from(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player, node: Node) {
        const response = await node.start(player)

        const embed = BasicEmbed.from(i, i.user, Colors.Red)

        switch (response.type) {
            case NodeStartCollectResponseType.Busy: {
                embed
                    .setTitle("Busy")
                    .setDescription(`You're already ${node.type}!`)
                break
            }

            case NodeStartCollectResponseType.MissingRequirements: {
                embed.setTitle("Missing Requirements")
                    .setDescription(response.errors.map(Util.addPoint).join("\n"))
                break
            }

            case NodeStartCollectResponseType.Success: {
                embed
                    .setColor(Colors.Green)
                    .setTitle("Success")
                    .setThumbnail(node.image)
                    .setDescription(`You've started ${node.type} at ${node.name}!`)
                break
            }
        }

        await Util.reply(i, {
            ephemeral: true,
            embeds: [embed]
        })

        return response.type === NodeStartCollectResponseType.Success
    }
}