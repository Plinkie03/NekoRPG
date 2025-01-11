import { Monster } from "../../structures/monster/Monster.js";
import IronSword from "../item/gear/weapon/sword/IronSword.js";

export default new Monster({
    id: 2,
    level: 5,
    name: "Slime Queen",
    emoji: "<:slimequeen:1327671088317993103>",
    stats: {
        maxHealth: 1_000,
        strength: 5
    },
    description: "A weird sticky mass",
    rewards: {
        xp: 500,
        money: 50,
        gems: 10
    }
})