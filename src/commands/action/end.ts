import { Colors } from "discord.js";
import { Command } from "../../structures/discord/Command.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { NodeFinishCollectResponseType, NodeStartCollectResponseType } from "../../structures/resource/node/Node.js";
import { Util } from "../../structures/static/Util.js";
import { Tasks } from "../../structures/player/PlayerTasks.js";
import { TimeParser } from "../../Constants.js";
import { BasicEmbed } from "../../structures/static/embeds/BasicEmbed.js";
import { ActionEndResponse } from "../../structures/static/responses/ActionEndResponse.ts.js";

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
        return ActionEndResponse.from(payload.instance, payload.extras.player, payload.args[0])
    },
})