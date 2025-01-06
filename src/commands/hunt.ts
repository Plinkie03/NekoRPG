import { Command } from "../structures/discord/Command.js";
import { ArgType } from "../structures/discord/Shared.js";
import { Responses } from "../structures/static/Responses.js";
import { FightMonsterResponse } from "../structures/static/responses/FightMonsterResponse.js";

export default new Command({
    name: "hunt",
    description: "Hunt a monster",
    args: [
        {
            name: "monster",
            description: "The mob to fight",
            type: ArgType.ZoneMonster,
            required: true
        }
    ],
    async execute(payload) {
        return FightMonsterResponse.from(payload.instance, payload.extras.player, payload.args[0])
    },
})