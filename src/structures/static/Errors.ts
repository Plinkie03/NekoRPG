import { codeBlock, RepliableInteraction } from "discord.js";
import { Logger } from "./Logger.js";
import { Embeds } from "./Embeds.js";
import { emptyString } from "../../Constants.js";

export class Errors {
    private constructor() {

    }

    public static async interaction(i: RepliableInteraction<"cached">, error: unknown) {
        if (error instanceof Error) {
            Logger.error(error)

            const embed = Embeds.basic(i, i.user, "Red")

            embed.setTitle("Interaction Error")
                .setDescription(`The interaction has thrown an error, it has been reported to the Developer!`)

            if (error.stack) {
                embed.addFields({
                    name: "\u200b",
                    value: codeBlock("js", error.stack)
                })
            }

            if (!("editReply" in i)) return

            // @ts-ignore
            await i[i.replied ? "editReply" : "reply"]({
                embeds: [
                    embed
                ],
                content: emptyString,
                ephemeral: true
            })
        }
    }
}