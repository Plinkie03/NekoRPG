import { Command } from "../structures/discord/Command.js";
import { ArgType } from "../structures/discord/Shared.js";
import { Responses } from "../structures/static/Responses.js";
import { FightEntityResponse } from "../structures/static/responses/FightEntityResponse.js";

export default new Command({
    name: "challenge",
    description: "Challenge a player",
    args: [
        {
            name: "player",
            description: "The player to challenge",
            type: ArgType.Player,
            required: true
        }
    ],
    async execute(payload) {
        return FightEntityResponse.from(payload.instance, payload.extras.player, payload.args[0])
    },
})