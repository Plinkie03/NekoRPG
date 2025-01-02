import { Command } from "../../structures/discord/Command.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { Responses } from "../../structures/static/Responses.js";
import { DisplayItemResponse } from "../../structures/static/responses/DisplayItemResponse.js";

export default new Command({
    name: "item",
    description: "Display info of an item",
    args: [
        {
            name: "item",
            description: "The item to show info",
            type: ArgType.Item,
            required: true
        }
    ],
    execute(payload) {
        return DisplayItemResponse.from(payload.instance, payload.extras.player, payload.args[0])
    },
})