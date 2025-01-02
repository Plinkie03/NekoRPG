import { Command } from "../structures/discord/Command.js";
import { DisplayProfileResponse } from "../structures/static/responses/DisplayProfileResponse.js";

export default new Command({
    name: "profile",
    description: "Displays your profile",
    async execute(payload) {
        return DisplayProfileResponse.from(payload.instance, payload.extras.player)
    },
})