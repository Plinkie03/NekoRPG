import { Monster } from "../../structures/monster/Monster.js";
import IronSword from "../item/gear/iron/IronSword.js";

export default new Monster({
    id: 1,
    level: 1,
    name: "Slime",
    emoji: "<:slime:1324071700102512843>",
    stats: {
        maxHealth: 50,
        strength: 5
    },
    description: "A weird sticky mass",
    rewards: {
        xp: 50,
        money: 5,
        gems: 1
    }
})