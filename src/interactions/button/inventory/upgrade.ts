import { emptyString } from "../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../structures/discord/Shared.js";
import { Responses } from "../../../structures/static/Responses.js";
import { DisplayInventoryItemResponse } from "../../../structures/static/responses/info/DisplayInventoryItemResponse.js";
import { UpgradeItemResponse } from "../../../structures/static/responses/UpgradeItemResponse.js";

export default new DiscordInteractionHandler({
    id: 21,
    ownerOnly: true,
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
            description: emptyString,
            type: ArgType.String,
            required: true
        }
    ],
    async execute(payload) {
        return UpgradeItemResponse.from(payload.instance, payload.extras.player, payload.args[1])
    },
})