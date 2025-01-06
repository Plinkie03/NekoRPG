import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "../../../player/Player.js";
import { Node } from "../../../resource/node/Node.js";
import { NodeEmbed } from "../../embeds/NodeEmbed.js";
import { Util } from "../../Util.js";

export class DisplayNodeResponse {
    private constructor() {}

    public static async from(i: ChatInputCommandInteraction<'cached'>, player: Player, node: Node) {
        await Util.reply(i, {
            ephemeral: true,
            embeds: [
                await NodeEmbed.from(i, i.user, node)
            ]
        })
        
        return true
    }
}