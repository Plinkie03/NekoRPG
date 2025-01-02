import { ActionRowBuilder, AutocompleteInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Colors, ModalSubmitInteraction } from "discord.js";
import { GlobalExtrasData } from "../discord/Shared.js";
import manageInventoryPage, { ActionType } from "../../interactions/button/inventory/page.js";
import viewInventoryItem from "../../interactions/button/inventory/view.js";
import { emptyString } from "../../Constants.js";
import destroyInventoryItem from "../../interactions/button/inventory/destroy.js";
import lockInventoryItem from "../../interactions/button/inventory/lock.js";
import equipInventoryItem from "../../interactions/button/inventory/equip.js";
import { Monster } from "../monster/Monster.js";
import { Fight } from "../battle/Fight.js";
import { Player } from "../player/Player.js";
import retry from "../../interactions/button/fight/retry.js";
import { CraftItemResponseType, Item } from "../resource/Item.js";
import craftItem from "../../interactions/button/info/item/craft.js";
import { Util } from "./Util.js";
import bulkCraftItem from "../../interactions/button/info/item/bulkCraft.js";
import viewItem from "../../interactions/button/info/item/view.js";
import { BasicEmbed } from "./embeds/BasicEmbed.js";
import { InventoryItemEmbed } from "./embeds/InventoryItemEmbed.js";
import { FightEmbed } from "./embeds/FightEmbed.js";
import { ItemEmbed } from "./embeds/ItemEmbed.js";

/**
 * TODO: Migrate each method to its own class in /responses/
 */
export class Responses {
    private constructor() {}

    public static async bulkCraftItem(input: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'> | ModalSubmitInteraction<'cached'>, player: Player, item: Item, times: number, disableButtons = false) {
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
                    custom_id: viewItem.id(input.user, item),
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

    public static async displayItem(input: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player, item: Item) {
        const embed = await ItemEmbed.from(input, input.user, item)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    label: "Craft",
                    disabled: !item.isCraftable() || item.hasCraftRequirements(player) !== true,
                    style: ButtonStyle.Primary,
                    custom_id: craftItem.id(input.user, item)
                }),
                new ButtonBuilder({
                    label: "Bulk Craft",
                    disabled: !item.isCraftable() || item.hasCraftRequirements(player) !== true,
                    style: ButtonStyle.Primary,
                    custom_id: bulkCraftItem.id(input.user, item)
                })
            )

        await input[(input.isButton() ? "update" : "reply") as "reply"]({
            ephemeral: true,
            embeds: [embed],
            components: [row]
        })

        return true
    }

    public static async fightMonster(input: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player, mob: Monster) {
        mob = mob.clone()

        const fight = new Fight([
            [ player ],
            [ mob ]
        ])

        function advance(finish = false) {
            const row = new ActionRowBuilder<ButtonBuilder>()
            
            if (finish) {
                row.addComponents(
                    new ButtonBuilder({
                        emoji: "🔄",
                        custom_id: retry.id(input.user, mob),
                        label: "Retry",
                        style: ButtonStyle.Primary
                    })
                )
            }

            return input[(!input.replied ? (input.isButton() ? "update" : "reply") : "editReply") as "reply"]({
                ephemeral: true,
                embeds: [
                    FightEmbed.from(input, input.user, fight, mob)
                ],
                components: finish ? [ row ] : []
            })
        }

        fight.on("round", advance.bind(null, false))

        await fight.start()

        await advance(true)

        return true
    }


    public static async displayInventoryItem(input: ButtonInteraction<'cached'>, extras: GlobalExtrasData, uuid: string, page: number) {
        const invItem = extras.player.inventory.getItemByUUID(uuid)
        if (!invItem) {
            await input.reply({
                ephemeral: true,
                content: `That item doesn't exist :(`
            })
            return false
        }

        const embed = (await InventoryItemEmbed.from(input, input.user, invItem))
            .setTitle(invItem.item.simpleName)
            .setThumbnail(invItem.item.image)

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    custom_id: manageInventoryPage.id(input.user, page, ActionType.Stay),
                    label: "Back",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: destroyInventoryItem.id(input.user, invItem.uuid, page),
                    label: "Destroy",
                    disabled: !invItem.destroyable,
                    style: ButtonStyle.Danger
                }),
                new ButtonBuilder({
                    custom_id: viewInventoryItem.id(input.user, invItem.uuid, page),
                    label: "Refresh",
                    emoji: "🔄",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: lockInventoryItem.id(input.user, invItem.uuid, page),
                    label: invItem.locked ? "Unlock" : "Lock",
                    style: ButtonStyle.Secondary
                })
            )

        if (invItem.item.equippable) {
            const reqs = invItem.equipped ? true : invItem.hasRequirements()

            actionRow.addComponents(
                new ButtonBuilder({
                    custom_id: equipInventoryItem.id(input.user, invItem.uuid, page),
                    label: !invItem.equipped ? "Equip" : "Unequip",
                    disabled: reqs !== true,
                    style: ButtonStyle.Secondary
                })
            )
        }

        await input.update({
            embeds: [embed],
            content: emptyString,
            components: [actionRow] 
        })

        return true
    }

    public static async displayInventory(input: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, extras: GlobalExtrasData, page: number) {
        const items = extras.player.inventory.page(page)

        if (!items.length) {
            await input.reply({
                ephemeral: true,
                content: `That page doesn't exist anymore :(`
            })
            return false
        }

        const embed = BasicEmbed.from(input, input.user, Colors.Aqua)
            .setDescription(
                items.map(
                    (x, i) => `[${x.index! + 1}] ${x.detailedName() + x.detailedAmount}`
                ).join("\n")
            )

        const movementRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder({
                    custom_id: manageInventoryPage.id(input.user, page, ActionType.Back),
                    label: "Back",
                    disabled: page === 1,
                    emoji: "◀️",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: manageInventoryPage.id(input.user, page, ActionType.Stay),
                    label: "Refresh",
                    emoji: "🔄",
                    style: ButtonStyle.Primary
                }),
                new ButtonBuilder({
                    custom_id: manageInventoryPage.id(input.user, page, ActionType.Next),
                    emoji: "▶️",
                    label: "Next",
                    disabled: extras.player.inventory.page(page + 1).length === 0,
                    style: ButtonStyle.Primary
                })
            ])
        
        const itemRows = new Array<ActionRowBuilder<ButtonBuilder>>(new ActionRowBuilder<ButtonBuilder>())

        for (let i = 0, len = items.length;i < len;i++) {
            const itm = items[i]
            const row = itemRows.at(-1)!
            const index = itm.index!

            row.addComponents(
                new ButtonBuilder({
                    custom_id: viewInventoryItem.id(input.user, itm.uuid, page),
                    label: (index + 1).toString(),
                    style: ButtonStyle.Secondary
                })
            )

            if (row.components.length === 5 && i + 1 !== len)
                itemRows.push(new ActionRowBuilder())
        }

        // @ts-ignore
        await input[input.isButton() ? "update" : "reply"]({
            embeds: [embed],
            components: [ 
                movementRow,
                ...itemRows
            ],
            content: emptyString,
            ephemeral: true
        })

        return true
    }
}