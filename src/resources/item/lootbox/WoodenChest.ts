import { Item, ItemType } from "../../../structures/resource/Item.js";
import IronSword from "../gear/weapon/sword/IronSword.js";
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
                    amount: 20,
                    item: BirchLog
                }
            ]
        },
        rewards: {
            skills: {
                smithing: 50
            }
        }
    }
})