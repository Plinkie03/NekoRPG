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
    

    


    


}