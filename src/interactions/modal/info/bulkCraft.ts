import { emptyString } from "../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../structures/discord/Shared.js";
import { Responses } from "../../../structures/static/Responses.js";
import { BulkCraftItemResponse } from "../../../structures/static/responses/BulkCraftItemResponse.js";

export default new DiscordInteractionHandler({
    id: 9,
    type: DiscordInteractionType.Modal,
    args: [
        {
            name: "user",
            description: emptyString,
            type: ArgType.User,
            required: true
        },
        {
            name: "item",
            description: emptyString,
            type: ArgType.Item,
            required: true
        }
    ],
    ownerOnly: true,
    async execute(payload) {
        return BulkCraftItemResponse.from(payload.instance, payload.extras.player, payload.args[1], Number(payload.instance.fields.getTextInputValue("times")))
    },
})