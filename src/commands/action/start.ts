import { Colors } from "discord.js";
import { Command } from "../../structures/discord/Command.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { NodeStartCollectResponseType } from "../../structures/resource/node/Node.js";
import { Util } from "../../structures/static/Util.js";
import { BasicEmbed } from "../../structures/static/embeds/BasicEmbed.js";

export default new Command({
    name: "start",
    description: "Start an action",
    args: [
        {
            name: "node",
            required: true,
            type: ArgType.ZoneNode,
            description: "The node to use"
        }
    ],
    async execute(payload) {
        const node = payload.args[0]
        const response = await node.start(payload.extras.player)

        const embed = BasicEmbed.from(payload.instance, payload.instance.user, Colors.Red)

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
                    .setDescription(`You've started ${node.type}!`)
                break
            }
        }

        await payload.instance.reply({
            ephemeral: true,
            embeds: [ embed ]
        })

        return response.type === NodeStartCollectResponseType.Success
    },
})