import { Colors } from "discord.js";
import { Command } from "../../structures/discord/Command.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { NodeFinishCollectResponseType, NodeStartCollectResponseType } from "../../structures/resource/node/Node.js";
import { Util } from "../../structures/static/Util.js";
import { Tasks } from "../../structures/player/PlayerTasks.js";
import { TimeParser } from "../../Constants.js";
import { BasicEmbed } from "../../structures/static/embeds/BasicEmbed.js";

export enum ActionType {
    Woodcutting,
    Mining
}

export default new Command({
    name: "end",
    description: "End an action",
    args: [
        {
            name: "action",
            description: "The action to finish",
            type: ArgType.Enum,
            enum: ActionType,
            required: true
        }
    ],
    async execute(payload) {
        const action = ActionType[payload.args[0]].toLowerCase() as keyof Tasks

        const response = await payload.extras.player.tasks.finish(action)

        const embed = BasicEmbed.from(payload.instance, payload.instance.user, Colors.Red)

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

        await payload.instance.reply({
            ephemeral: true,
            embeds: [ embed ]
        })

        return response !== false && response.type === NodeFinishCollectResponseType.Success
    },
})