import { emptyString } from "../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../structures/discord/Shared.js";
import { OpenLootboxResponse } from "../../../structures/static/responses/OpenLootboxResponse.js";

export default new DiscordInteractionHandler({
    id: 16,
    type: DiscordInteractionType.Button,
    args: [
        {
            name: "user",
            type: ArgType.User,
            description: emptyString,
            required: true
        },
        {
            name: "inventory item",
            required: true,
            type: ArgType.InventoryItem,
            description: emptyString
        },
        {
            name: "page",
            type: ArgType.Integer,
            description: emptyString,
            required: true
        }
    ],
    ownerOnly: true,
    execute(payload) {
        return OpenLootboxResponse.from(payload.instance, payload.args[1], payload.args[2], 1)
    },
})