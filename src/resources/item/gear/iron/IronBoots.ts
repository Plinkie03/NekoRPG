import { GearType, Item, ItemType, WeaponType } from "../../../../structures/resource/Item.js";
import Berserk from "../../../passive/Berserk.js";
import Execution from "../../../passive/Execution.js";
import PoisonEdge from "../../../passive/PoisonEdge.js";
import Rage from "../../../passive/Rage.js";
import IronIngot from "../../material/ingot/IronIngot.js";
import BirchLog from "../../material/log/BirchLog.js";
import Wood from "../../material/log/BirchLog.js";

export default new Item({
    id: 14,
    type: ItemType.Gear,
    gearType: GearType.Boots,
    name: "Iron Boots",
    emoji: "<:iron_boots:1327760848521007156>",
    description: "Boots forged by iron",
    stats: {
        defense: 6,
        agility: 15
    },
    craft: {
        requirements: {
            items: [
                {
                    item: IronIngot,
                    amount: 10
                }
            ]
        },
        rewards: {
            skills: {
                smithing: 50
            }
        }
    },
})