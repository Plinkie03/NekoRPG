import { ButtonInteraction, ChatInputCommandInteraction, Colors } from "discord.js"
import { Node, NodeAction, NodeFinishCollectResponseType, NodeStartCollectResponseType } from "../../resource/node/Node.js"
import { Player } from "../../player/Player.js"
import { BasicEmbed } from "../embeds/BasicEmbed.js"
import { Util } from "../Util.js"
import { TimeParser } from "../../../Constants.js"

export class ActionEndResponse {
    public static async from(i: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>, player: Player, type: NodeAction) {
        const action = NodeAction[type].toLowerCase()

        const response = await player.tasks.finish(type)

        const embed = BasicEmbed.from(i, i.user, Colors.Red)

        if (response === false) {
            embed
                .setTitle("Not Busy")
                .setDescription(`You are not performing this action currently.`)
        } else {
            switch (response.type) {
                case NodeFinishCollectResponseType.Failed: {
                    embed
                        .setTitle("Failed")
                        .setDescription(`You've been ${response.node.type} for ${TimeParser.parseToString(response.elapsed)} but did not get any materials...`)
                    break
                }

                case NodeFinishCollectResponseType.Success: {
                    embed
                        .setTitle("Success")
                        .setColor(Colors.Green)
                        .setThumbnail(response.node.image)
                        .setDescription(`You've been ${response.node.type} at ${response.node.name} for ${TimeParser.parseToString(response.elapsed)} and received the following materials:\n${response.results.map(
                            x => x.rewards.map(Util.addPoint).join("\n")
                        ).join("\n\n")}`)
                    break
                }
            }
        }

        await Util.reply(i, {
            ephemeral: true,
            embeds: [embed]
        })

        return response !== false && response.type === NodeFinishCollectResponseType.Success
    }
}