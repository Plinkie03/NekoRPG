import { emptyString } from "../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../structures/discord/Shared.js";
import { DisplayProfileResponse } from "../../../structures/static/responses/DisplayProfileResponse.js";

export default new DiscordInteractionHandler({
    id: 14,
    type: DiscordInteractionType.Button,
    args: [
        {
            name: "user",
            required: true,
            type: ArgType.User,
            description: emptyString
        }
    ],
    ownerOnly: true,
    execute(payload) {
        return DisplayProfileResponse.fromSpells(payload.instance, payload.extras.player)
    },
})