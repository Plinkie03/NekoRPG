import NekoDatabase from "../core/NekoDatabase.js"
import Slime from "../resources/monster/Slime.js"
import { Action } from "../structures/battle/actions/Action.js"
import { Fight } from "../structures/battle/Fight.js"

NekoDatabase.getPlayerById("123").then(async p1 => {
    const mobs = Array.from({ length: 1 }, _ => Slime.clone())

    const fight = new Fight([
        [ p1 ],
        mobs
    ])

    fight.on("round", function(fight) {
        console.log(`\n\nROUND ${fight.round}`)
        console.log(Action.format(fight.lastLog))
    })

    await fight.start()

    console.log(`Winners:`, fight.getWinnerTeam()?.map(x => x.displayName).join(", "))

    console.log(`\n\nRewards:`)
    
    fight.rewards.forEach((rewards, player) => {
        console.log(`\n\n${player.displayName}:`)
        rewards.forEach(msg => console.log(msg))
    })
})