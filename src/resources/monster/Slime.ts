import { Monster } from "../../structures/monster/Monster.js";

export default new Monster({
    id: 1,
    level: 1,
    name: "Slime",
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