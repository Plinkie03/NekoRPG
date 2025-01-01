import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { emptyString } from "../../../../Constants.js";
import { DiscordInteractionHandler, DiscordInteractionType } from "../../../../structures/discord/DiscordInteractionHandler.js";
import { ArgType } from "../../../../structures/discord/Shared.js";
import { Responses } from "../../../../structures/static/Responses.js";
import bulkCraft from "../../../modal/info/bulkCraft.js";

export default new DiscordInteractionHandler({
    id: 8,
    ownerOnly: true,
    type: DiscordInteractionType.Button,
    args: [
        {
            description: emptyString,
            name: "user",
            type: ArgType.User,
            required: true
        },
        {
            name: "item",
            type: ArgType.Item,
            required: true,
            description: emptyString
        }
    ],
    async execute(payload) {
        const modal = new ModalBuilder()
            .setCustomId(bulkCraft.id(...payload.args))
            .setTitle("Bulk Craft")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder({
                            custom_id: "times",
                            label: "Amount",
                            required: true,
                            style: TextInputStyle.Short,
                            placeholder: "How many times to craft this item"
                        })
                    )
            )

        await payload.instance.showModal(modal)

        return true
    }
})