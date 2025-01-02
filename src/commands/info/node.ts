import { Command } from "../../structures/discord/Command.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { Responses } from "../../structures/static/Responses.js";
import { DisplayItemResponse } from "../../structures/static/responses/DisplayItemResponse.js";
import { DisplayNodeResponse } from "../../structures/static/responses/DisplayNodeResponse.js";

export default new Command({
    name: "node",
    description: "Display info of a node",
    args: [
        {
            name: "node",
            description: "The node to show info",
            type: ArgType.Node,
            required: true
        }
    ],
    execute(payload) {
        return DisplayNodeResponse.from(payload.instance, payload.extras.player, payload.args[0])
    },
})