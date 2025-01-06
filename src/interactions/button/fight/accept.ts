import { emptyString } from "../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../structures/discord/Shared.js";
import { Responses } from "../../../structures/static/Responses.js";
import { FightEntityResponse } from "../../../structures/static/responses/FightEntityResponse.js";

export default new DiscordInteractionHandler({
    id: 20,
    type: DiscordInteractionType.Button,
    ownerOnly: true,
    args: [
        {
            description: emptyString,
            name: "target",
            type: ArgType.Player,
            required: true
        },
        {
            description: emptyString,
            name: "requester",
            type: ArgType.Player,
            required: true
        },
    ],
    async execute(payload) {
        return FightEntityResponse.from(payload.instance, payload.args[0], payload.args[1])
    },
})