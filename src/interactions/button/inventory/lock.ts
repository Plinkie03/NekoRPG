import { emptyString } from "../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../structures/discord/Shared.js";
import { Responses } from "../../../structures/static/Responses.js";
import { DisplayInventoryItemResponse } from "../../../structures/static/responses/info/DisplayInventoryItemResponse.js";

export default new DiscordInteractionHandler({
    id: 4,
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
        await payload.extras.player.inventory.getItemByUUID(payload.args[1])?.setLocked()
        return DisplayInventoryItemResponse.from(payload.instance, payload.extras, payload.args[1], null)
    },
})