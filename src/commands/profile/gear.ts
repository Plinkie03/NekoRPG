import { Command } from "../../structures/discord/Command.js";
import { DisplayProfileResponse } from "../../structures/static/responses/info/DisplayProfileResponse.js";

export default new Command({
    name: "gear",
    description: "Displays your profile gear",
    async execute(payload) {
        return DisplayProfileResponse.fromGear(payload.instance, payload.extras.player)
    },
})