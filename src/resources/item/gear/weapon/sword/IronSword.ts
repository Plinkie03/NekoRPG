import { GearType, Item, ItemType, WeaponType } from "../../../../../structures/resource/Item.js";
import Berserk from "../../../../passive/Berserk.js";
import Execution from "../../../../passive/Execution.js";
import PoisonEdge from "../../../../passive/PoisonEdge.js";
import Rage from "../../../../passive/Rage.js";
import IronIngot from "../../../material/ingot/IronIngot.js";
import BirchLog from "../../../material/log/BirchLog.js";
import Wood from "../../../material/log/BirchLog.js";

export default new Item({
    id: 1,
    type: ItemType.Gear,
    gearType: GearType.Weapon,
    name: "Iron Sword",
    emoji: "<:ironsword:1324072952379084840>",
    description: "A cute sword",
    stats: {
        strength: 10
    },
    passives: [
        Berserk,
        Rage,
        PoisonEdge,
        Execution
    ],
    craft: {
        requirements: {
            items: [
                {
                    item: IronIngot,
                    amount: 5
                },
                {
                    item: BirchLog,
                    amount: 10
                }
            ]
        },
        rewards: {
            skills: {
                smithing: 25
            }
        }
    },
    weaponType: WeaponType.Sword
})