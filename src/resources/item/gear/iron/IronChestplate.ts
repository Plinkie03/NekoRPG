import { GearType, Item, ItemType, WeaponType } from "../../../../structures/resource/Item.js";
import Berserk from "../../../passive/Berserk.js";
import Execution from "../../../passive/Execution.js";
import PoisonEdge from "../../../passive/PoisonEdge.js";
import Rage from "../../../passive/Rage.js";
import IronIngot from "../../material/ingot/IronIngot.js";
import BirchLog from "../../material/log/BirchLog.js";
import Wood from "../../material/log/BirchLog.js";

export default new Item({
    id: 12,
    type: ItemType.Gear,
    gearType: GearType.Chestplate,
    name: "Iron Chestplate",
    emoji: "<:iron_chestplate:1327761093933793280>",
    description: "A chestplate forged by iron",
    stats: {
        defense: 12,
        maxHealth: 50
    },
    craft: {
        requirements: {
            items: [
                {
                    item: IronIngot,
                    amount: 15
                }
            ]
        },
        rewards: {
            skills: {
                smithing: 75
            }
        }
    },
})