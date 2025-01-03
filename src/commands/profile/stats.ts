import { Command } from "../../structures/discord/Command.js";
import { DisplayProfileResponse } from "../../structures/static/responses/info/DisplayProfileResponse.js";

export default new Command({
    name: "stats",
    description: "Displays your profile stats",
    async execute(payload) {
        return DisplayProfileResponse.fromStats(payload.instance, payload.extras.player)
    },
})