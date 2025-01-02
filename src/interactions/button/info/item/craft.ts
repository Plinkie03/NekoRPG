import { emptyString } from "../../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../../structures/discord/Shared.js";
import { Responses } from "../../../../structures/static/Responses.js";
import { BulkCraftItemResponse } from "../../../../structures/static/responses/BulkCraftItemResponse.js";

export default new DiscordInteractionHandler({
    id: 7,
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
        return BulkCraftItemResponse.from(payload.instance, payload.extras.player, payload.args[1], 1)
    }
})