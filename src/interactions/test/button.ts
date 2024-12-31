import { User } from "discord.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { emptyString } from "../../Constants.js";

export default new DiscordInteractionHandler({
    id: 1,
    type: DiscordInteractionType.Button,
    args: [
        {
            name: "user",
            type: ArgType.Enum,
            enum: ArgType,
            description: emptyString,
            required: true
        }
    ] as const,
    async execute(i, args, extras) {
        console.log("wow", args)
        return true
    },
})