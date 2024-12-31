import NekoDatabase from "../core/NekoDatabase.js"
import Slime from "../resources/monster/Slime.js"
import { Action } from "../structures/battle/actions/Action.js"
import { Fight } from "../structures/battle/Fight.js"

NekoDatabase.getPlayer("123").then(async p1 => {
    const mobs = Array.from({ length: 3 }, _ => Slime.clone())

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
})