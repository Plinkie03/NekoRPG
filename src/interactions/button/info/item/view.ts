import { emptyString } from "../../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../../structures/discord/Shared.js";
import { Responses } from "../../../../structures/static/Responses.js";
import { DisplayItemResponse } from "../../../../structures/static/responses/info/DisplayItemResponse.js";

export default new DiscordInteractionHandler({
    id: 10,
    ownerOnly: true,
    type: DiscordInteractionType.Button,
    args: [
        {
            description: emptyString,
            name: "user",
            type: ArgType.User,
            required: true
        },
        {
            name: "item",
            type: ArgType.Item,
            required: true,
            description: emptyString
        }
    ],
    async execute(payload) {
        return DisplayItemResponse.from(payload.instance, payload.extras.player, payload.args[1])
    }
})