import { Base, User } from "discord.js"
import { NekoClient } from "../../../core/NekoClient.js"
import { PlayerInventoryItem } from "../../player/PlayerInventoryItem.js"
import { ItemEmbed } from "./ItemEmbed.js"

export class InventoryItemEmbed {
    private constructor() {}

    public static async from(i: Base, to: User, invItem: PlayerInventoryItem) {
        const client = NekoClient.from(i)

        const embed = (await ItemEmbed.from(i, to, invItem))
            .setTitle(invItem.detailedName())

        return embed
    }
}