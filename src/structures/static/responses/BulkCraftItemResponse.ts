import { ChatInputCommandInteraction, ButtonInteraction, ModalSubmitInteraction, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { Player } from "../../player/Player.js"
import { Item, CraftItemResponseType } from "../../resource/Item.js"
import { BasicEmbed } from "../embeds/BasicEmbed.js"
import { Util } from "../Util.js"
import view from "../../../interactions/button/info/item/view.js"

export class BulkCraftItemResponse {
    private constructor() {}

    public static async from(input: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'> | ModalSubmitInteraction<'cached'>, player: Player, item: Item, times: number, disableButtons = false) {
        times = Math.max(times || 1, 1)

        const response = await item.craft(player, times)

        const embed = BasicEmbed.from(input, input.user, Colors.Red)
        
        switch (response.type) {
            case CraftItemResponseType.Failure: {
                embed.setTitle("Failed")
                    .setDescription(`You tried to craft ${item.simpleName} ${Util.plural("time", times)} but all failed miserably`)
                break
            }

            case CraftItemResponseType.MissingRequirements: {
                embed.setTitle("Missing Requirements")
                    .setDescription(`You missing the following requirements:\n${response.errors.map(Util.addPoint).join("\n")}`)
                break
            }

            case CraftItemResponseType.NotCraftable: {
                embed.setTitle("Not Craftable")
                    .setDescription("The item has no crafting recipe!")
                break
            }

            case CraftItemResponseType.Success: {
                embed.setColor(Colors.Green)
                    .setTitle("Success")
                    .setDescription(`You've successfully crafted the following item ${item.simpleName} ${Util.plural("time", response.success)}:\n${response.rewards.map(Util.addPoint).join("\n")}`)
                break
            }
        }
        
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    custom_id: view.id(input.user, item),
                    label: "Back",
                    style: ButtonStyle.Primary
                })
            )

        await input[(input.isChatInputCommand() ? "reply" : "update") as "reply"]({
            ephemeral: true,
            embeds: [
                embed
            ],
            components: disableButtons ? [] : [
                row
            ]
        })

        return response.type === CraftItemResponseType.Success 
    }
}