import { Player } from "../structures/player/Player.js";
import { PlayerSkills } from "../structures/player/PlayerSkills.js";
import { Formulas } from "../structures/static/Formulas.js";

const times = 100
for (let i = 0;i <= times;i += (times / 100)) {
    console.log("\n\nLEVEL: ", i)
    console.log(Formulas.calculateSkillMultiplier(i).toFixed(2) + "x")
    console.log(Formulas.calculateReqXp(i, Player.DefaultXpReq, PlayerSkills.DefaultXpMultiplier).toLocaleString(), "xp")
    console.log(Formulas.calculateReqXp(i, PlayerSkills.DefaultXpReq, PlayerSkills.DefaultXpMultiplier).toLocaleString(), "skill xp")
}