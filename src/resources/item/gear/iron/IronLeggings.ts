import { GearType, Item, ItemType, WeaponType } from "../../../../structures/resource/Item.js";
import Berserk from "../../../passive/Berserk.js";
import Execution from "../../../passive/Execution.js";
import PoisonEdge from "../../../passive/PoisonEdge.js";
import Rage from "../../../passive/Rage.js";
import IronIngot from "../../material/ingot/IronIngot.js";
import BirchLog from "../../material/log/BirchLog.js";
import Wood from "../../material/log/BirchLog.js";

export default new Item({
    id: 13,
    type: ItemType.Gear,
    gearType: GearType.Leggings,
    name: "Iron Leggings",
    emoji: "<:iron_chestplate:1327761093933793280>",
    description: "Leggings forged by iron",
    stats: {
        defense: 10,
        agility: 10
    },
    craft: {
        requirements: {
            items: [
                {
                    item: IronIngot,
                    amount: 12
                }
            ]
        },
        rewards: {
            skills: {
                smithing: 60
            }
        }
    },
})