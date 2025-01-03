import { Command } from "../../structures/discord/Command.js";
import { DisplayProfileResponse } from "../../structures/static/responses/info/DisplayProfileResponse.js";

export default new Command({
    name: "skills",
    description: "Displays your profile skills",
    async execute(payload) {
        return DisplayProfileResponse.fromSkills(payload.instance, payload.extras.player)
    },
})