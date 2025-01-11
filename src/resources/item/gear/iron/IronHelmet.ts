import { GearType, Item, ItemType, WeaponType } from "../../../../structures/resource/Item.js";
import Berserk from "../../../passive/Berserk.js";
import Execution from "../../../passive/Execution.js";
import PoisonEdge from "../../../passive/PoisonEdge.js";
import Rage from "../../../passive/Rage.js";
import IronIngot from "../../material/ingot/IronIngot.js";
import BirchLog from "../../material/log/BirchLog.js";
import Wood from "../../material/log/BirchLog.js";

export default new Item({
    id: 11,
    type: ItemType.Gear,
    gearType: GearType.Helmet,
    name: "Iron Helmet",
    emoji: "<:iron_helmet:1327762779381301359>",
    description: "A helmet forged by iron",
    stats: {
        defense: 5,
        maxHealth: 25
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