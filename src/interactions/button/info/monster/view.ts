import { emptyString } from "../../../../Constants.js"
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../../structures/discord/DiscordInteractionHandler.js"
import { ArgType } from "../../../../structures/discord/Shared.js"
import { DisplayMonsterResponse } from "../../../../structures/static/responses/info/DisplayMonsterResponse.js"

export default new DiscordInteractionHandler({
    id: 17,
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
            name: "monster",
            type: ArgType.Monster,
            required: true,
            description: emptyString
        }
    ],
    async execute(payload) {
        return DisplayMonsterResponse.from(payload.instance, payload.extras.player, payload.args[1])
    }
})