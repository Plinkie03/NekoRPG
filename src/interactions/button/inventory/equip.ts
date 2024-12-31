import { emptyString } from "../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../structures/discord/Shared.js";
import { Responses } from "../../../structures/static/Responses.js";

export default new DiscordInteractionHandler({
    id: 5,
    ownerOnly: true,
    type: DiscordInteractionType.Button,
    args: [
        {
            name: "user",
            type: ArgType.User,
            description: emptyString,
            required: true
        },
        {
            name: "uuid",
            description: emptyString,
            type: ArgType.String,
            required: true
        },
        {
            name: "page",
            description: emptyString,
            type: ArgType.Integer,
            required: true
        },
    ],
    async execute(payload) {
        const item = payload.extras.player.inventory.getItemByUUID(payload.args[1])
        if (item?.equipped)
            await item.unequip()
        else
            await item?.equip()
        
        return Responses.displayInventoryItem(payload.instance, payload.extras, payload.args[1], payload.args[2])
    },
})