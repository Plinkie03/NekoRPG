import { Command } from "../structures/discord/Command.js";
import { ArgType } from "../structures/discord/Shared.js";
import { Responses } from "../structures/static/Responses.js";

export default new Command({
    name: "fight",
    description: "Fight a monster",
    args: [
        {
            name: "monster",
            description: "The mob to fight",
            type: ArgType.ZoneMonster,
            required: true
        }
    ],
    async execute(payload) {
        return Responses.fightMonster(payload.instance, payload.extras.player, payload.args[0])
    },
})