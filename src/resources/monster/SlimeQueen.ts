import { Monster } from "../../structures/monster/Monster.js";
import IronSword from "../item/gear/iron/IronSword.js";
import SlimeArmy from "../item/spell/SlimeArmy.js";

export default new Monster({
    id: 2,
    level: 5,
    name: "Slime Queen",
    emoji: "<:slimequeen:1327671088317993103>",
    stats: {
        maxHealth: 2_500,
        strength: 50
    },
    spells: [
        SlimeArmy
    ],
    description: "A weird sticky mass",
    rewards: {
        xp: 500,
        money: 50,
        gems: 10
    }
})