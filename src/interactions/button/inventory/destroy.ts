import { emptyString } from "../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../structures/discord/Shared.js";
import { Responses } from "../../../structures/static/Responses.js";
import { DisplayInventoryResponse } from "../../../structures/static/responses/DisplayInventoryResponse.js";

export default new DiscordInteractionHandler({
    id: 3,
    type: DiscordInteractionType.Button,
    args: [
        {
            name: "user",
            type: ArgType.User,
            required: true,
            description: emptyString
        },
        {
            name: "uuid",
            type: ArgType.String,
            required: true,
            description: emptyString
        },
        {
            name: "page",
            type: ArgType.Integer,
            required: true,
            description: emptyString
        }
    ],
    ownerOnly: true,
    async execute(payload) {
        await payload.extras.player.inventory.getItemByUUID(payload.args[1])?.destroy()
        return DisplayInventoryResponse.from(payload.instance, payload.extras, payload.args[2])
    },    
})