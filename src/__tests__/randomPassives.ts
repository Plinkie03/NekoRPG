import IronSword from "../resources/item/gear/weapon/sword/IronSword.js";
import { GearType, Item } from "../structures/resource/Item.js";
import { Enum } from "../structures/static/Enum.js";
import { RarityType } from "../structures/static/Rarity.js";

Enum.values(RarityType).forEach(x => console.log(IronSword.getRandomPassives(x)))