import { SkillType } from "../../../../structures/player/PlayerSkills.js";
import { Item, ItemType } from "../../../../structures/resource/Item.js";
import IronOre from "../ore/IronOre.js";

export default new Item({
    id: 8,
    type: ItemType.Material,
    emoji: "<:iron_ingot:1324885840564064277>",
    name: "Iron Ingot",
    description: "Made of iron ores, can be used for something",
    craft: {
        requirements: {
            items: [
                {
                    amount: 5,
                    item: IronOre
                }
            ]
        },
        rewards: {
            skills: [
                { type: SkillType.Smithing, xp: 100 }
            ]
        }
    }
})