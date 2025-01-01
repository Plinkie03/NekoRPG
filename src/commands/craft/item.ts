import { Command } from "../../structures/discord/Command.js";
import { ArgType } from "../../structures/discord/Shared.js";
import { Responses } from "../../structures/static/Responses.js";

export default new Command({
    name: "item",
    description: "Cratfs an item",
    args: [
        {
            name: "item",
            description: "The item to craft",
            type: ArgType.Item,
            required: true
        },
        {
            name: "times",
            description: "How many times to craft this item",
            default: async () => 1,
            type: ArgType.Integer
        }
    ],
    execute(payload) {
        return Responses.bulkCraftItem(payload.instance, payload.extras.player, payload.args[0], payload.args[1], true)
    },
})