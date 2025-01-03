import { Command } from "../../structures/discord/Command.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { Responses } from "../../structures/static/Responses.js";
import { DisplayMonsterResponse } from "../../structures/static/responses/DisplayMonsterResponse.js";

export default new Command({
    name: "monster",
    description: "Display info of a monster",
    args: [
        {
            name: "monster",
            description: "The monster to show info",
            type: ArgType.Monster,
            required: true
        }
    ],
    execute(payload) {
        return DisplayMonsterResponse.from(payload.instance, payload.extras.player, payload.args[0])
    },
})