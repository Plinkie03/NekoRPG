import { Formulas } from "../structures/static/Formulas.js";

const times = 100
for (let i = 0;i <= times;i += (times / 100)) {
    console.log("\n\nLEVEL: ", i)
    console.log(Formulas.calculateSkillMultiplier(i).toFixed(2) + "x")
    console.log(Formulas.calculateReqXp(i, 100, 1.8).toLocaleString(), "xp")
    console.log(Formulas.calculateReqXp(i, 10, 1.2).toLocaleString(), "skill xp")
}