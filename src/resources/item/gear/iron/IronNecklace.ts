import { GearType, Item, ItemType, WeaponType } from "../../../../structures/resource/Item.js";
import Berserk from "../../../passive/Berserk.js";
import Execution from "../../../passive/Execution.js";
import PoisonEdge from "../../../passive/PoisonEdge.js";
import Rage from "../../../passive/Rage.js";
import IronIngot from "../../material/ingot/IronIngot.js";
import BirchLog from "../../material/log/BirchLog.js";
import Wood from "../../material/log/BirchLog.js";

export default new Item({
    id: 17,
    type: ItemType.Gear,
    gearType: GearType.Necklace,
    name: "Iron Necklace",
    emoji: "<:iron_necklace:1327763614798581781>",
    description: "Necklace forged by iron",
    stats: {
        dodgeRate: 5,
        strength: 12,
        criticalMultiplier: 20
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