import { emptyString } from "../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../structures/discord/Shared.js";
import { Responses } from "../../../structures/static/Responses.js";

export default new DiscordInteractionHandler({
    id: 6,
    type: DiscordInteractionType.Button,
    ownerOnly: true,
    args: [
        {
            description: emptyString,
            name: "user",
            type: ArgType.User,
            required: true
        },
        {
            description: emptyString,
            name: "monster",
            type: ArgType.ZoneMonster,
            required: true
        },
    ],
    execute(payload) {
        return Responses.fightMonster(payload.instance, payload.extras.player, payload.args[1])
    },
})