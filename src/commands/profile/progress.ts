import { Command } from "../../structures/discord/Command.js";
import { DisplayProfileResponse } from "../../structures/static/responses/DisplayProfileResponse.js";

export default new Command({
    name: "progress",
    description: "Displays your profile progress",
    async execute(payload) {
        return DisplayProfileResponse.fromProgress(payload.instance, payload.extras.player)
    },
})