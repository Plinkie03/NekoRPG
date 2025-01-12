import { SkillType } from "../../../../structures/player/PlayerSkills.js";
import { GearType, Item, ItemType, WeaponType } from "../../../../structures/resource/Item.js";
import Berserk from "../../../passive/Berserk.js";
import Execution from "../../../passive/Execution.js";
import PoisonEdge from "../../../passive/PoisonEdge.js";
import Rage from "../../../passive/Rage.js";
import IronIngot from "../../material/ingot/IronIngot.js";
import BirchLog from "../../material/log/BirchLog.js";
import Wood from "../../material/log/BirchLog.js";

export default new Item({
    id: 15,
    type: ItemType.Gear,
    gearType: GearType.Shield,
    name: "Iron Shield",
    emoji: "<:iron_shield:1327763119493087334>",
    description: "Shield forged by iron",
    stats: {
        maxHealth: 75,
        defense: 15,
        blockRate: 5
    },
    craft: {
        requirements: {
            items: [
                {
                    item: IronIngot,
                    amount: 25
                }
            ]
        },
        rewards: {
            skills: [
                { type: SkillType.Smithing, xp: 100 }
            ]
        }
    },
})