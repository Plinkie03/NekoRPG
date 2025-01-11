import { Colors } from "discord.js";
import { Command } from "../../structures/discord/Command.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { NodeStartCollectResponseType } from "../../structures/resource/node/Node.js";
import { Util } from "../../structures/static/Util.js";
import { BasicEmbed } from "../../structures/static/embeds/BasicEmbed.js";
import { ActionStartResponse } from "../../structures/static/responses/ActionStartResponse.js";

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
        return ActionStartResponse.from(payload.instance, payload.extras.player, payload.args[0])
    },
})