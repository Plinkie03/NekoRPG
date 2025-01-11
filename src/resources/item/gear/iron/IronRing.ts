import { GearType, Item, ItemType, WeaponType } from "../../../../structures/resource/Item.js";
import Berserk from "../../../passive/Berserk.js";
import Execution from "../../../passive/Execution.js";
import PoisonEdge from "../../../passive/PoisonEdge.js";
import Rage from "../../../passive/Rage.js";
import IronIngot from "../../material/ingot/IronIngot.js";
import BirchLog from "../../material/log/BirchLog.js";
import Wood from "../../material/log/BirchLog.js";

export default new Item({
    id: 16,
    type: ItemType.Gear,
    gearType: GearType.Ring,
    name: "Iron Ring",
    emoji: "<:iron_ring:1327765039071101000>",
    description: "Ring forged by iron",
    stats: {
        criticalRate: 5,
        lifesteal: 5,
        strength: 10
    },
    craft: {
        requirements: {
            items: [
                {
                    item: IronIngot,
                    amount: 20
                }
            ]
        },
        rewards: {
            skills: {
                smithing: 70
            }
        }
    },
})