import { Command } from "../../structures/discord/Command.js";
import { DisplayProfileResponse } from "../../structures/static/responses/info/DisplayProfileResponse.js";

export default new Command({
    name: "spells",
    description: "Displays your profile spells",
    async execute(payload) {
        return DisplayProfileResponse.fromSpells(payload.instance, payload.extras.player)
    },
})