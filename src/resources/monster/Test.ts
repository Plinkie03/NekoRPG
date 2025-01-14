import { Monster } from "../../structures/monster/Monster.js";
import IronSword from "../item/gear/iron/IronSword.js";
import SlimeArmy from "../item/spell/SlimeArmy.js";

export default new Monster({
    id: 3,
    level: 999,
    name: "Test",
    emoji: "<:slimequeen:1327671088317993103>",
    stats: {
        maxHealth: 250_000,
        strength: 30_000,
        defense: 10_000
    },
    spells: [
        SlimeArmy
    ],
    description: "A weird sticky mass",
    rewards: {
        xp: 50_000,
        money: 20_000,
        gems: 10_000
    }
})