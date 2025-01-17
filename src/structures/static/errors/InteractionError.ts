import { RepliableInteraction, codeBlock } from "discord.js"
import { emptyString } from "../../../Constants.js"
import { BasicEmbed } from "../embeds/BasicEmbed.js"
import { Logger } from "../Logger.js"
import { Util } from "../Util.js"

export class InteractionError {
    private constructor() {}

    public static async from(i: RepliableInteraction<"cached">, error: unknown) {
        if (error instanceof Error) {
            Logger.error(error)

            const embed = BasicEmbed.from(i, i.user, "Red")

            embed.setTitle("Interaction Error")
                .setDescription(`The interaction has thrown an error, it has been reported to the Developer!`)

            if (error.stack) {
                embed.addFields({
                    name: "\u200b",
                    value: codeBlock("js", error.stack)
                })
            }

            await Util.reply(i, {
                embeds: [
                    embed
                ],
                content: emptyString,
                ephemeral: true
            })
        }
    }
}