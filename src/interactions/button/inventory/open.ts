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
            name: "uuid",
            required: true,
            type: ArgType.String,
            description: emptyString
        }
    ],
    ownerOnly: true,
    execute(payload) {
        return OpenLootboxResponse.from(payload.instance, payload.extras.player, payload.args[1], 1)
    },
})