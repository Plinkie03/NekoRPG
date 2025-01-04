import { Item, ItemType } from "../../../../structures/resource/Item.js";
import Coal from "../ore/Coal.js";
import IronOre from "../ore/IronOre.js";

export default new Item({
    id: 9,
    emoji: "<:steel_ingot:1324886213500600382>",
    type: ItemType.Material,
    name: "Steel Ingot",
    description: "What happens when you mix iron and coal? This!",
    craft: {
        requirements: {
            items: [
                {
                    amount: 5,
                    item: IronOre
                },
                {
                    amount: 2,
                    item: Coal
                }
            ],
            skills: {
                smithing: 20
            }
        },
        chance: 80,
        rewards: {
            skills: {
                smithing: 250
            }
        }
    }
})