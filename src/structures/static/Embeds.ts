import { Base, ColorResolvable, EmbedBuilder, User } from "discord.js"
import { NekoClient } from "../../core/NekoClient.js"

/**
 * Some pre-built embeds
 */
export class Embeds {
    private constructor() {}

    public static basic(i: Base, to: User, color: ColorResolvable) {
        const client = NekoClient.from(i)

        const embed = new EmbedBuilder()
            .setAuthor({
                name: to.displayName,
                iconURL: to.displayAvatarURL()
            })
            .setColor(color)
            .setFooter({
                text: `❤ RPG Adventures with ${client.user.displayName}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp()

        return embed
    }
}