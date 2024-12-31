import { GearType, Item, ItemType, WeaponType } from "../../../../../structures/resource/Item.js";
import Wood from "../../../material/log/BirchLog.js";

export default new Item({
    id: 1,
    type: ItemType.Gear,
    gearType: GearType.Weapon,
    name: "Iron Sword",
    description: "A cute sword",
    stats: {
        strength: 10
    },
    craft: {
        requirements: {
            items: [
                {
                    item: Wood,
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