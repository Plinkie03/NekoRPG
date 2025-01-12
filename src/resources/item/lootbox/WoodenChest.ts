import { SkillType } from "../../../structures/player/PlayerSkills.js";
import { Item, ItemType } from "../../../structures/resource/Item.js";
import IronSword from "../gear/iron/IronSword.js";
import BirchLog from "../material/log/BirchLog.js";
import ArrowRain from "../spell/ArrowRain.js";

export default new Item<ItemType.Lootbox>({
    id: 6,
    name: "Wooden Chest",
    type: ItemType.Lootbox,
    emoji: "<:woodenchest:1324485419017961512>",
    rewards: {
        items: [
            {
                item: ArrowRain,
                chance: 25
            }
        ]
    },
    description: "A chest that you can open",
    craft: {
        requirements: {
            items: [
                {
                    amount: 10,
                    item: BirchLog
                }
            ]
        },
        rewards: {
            skills: [
                { type: SkillType.Smithing, xp: 50 }
            ]
        }
    }
})