import { setTimeout } from "timers/promises";
import NekoDatabase from "../core/NekoDatabase.js";
import IronSword from "../resources/item/gear/weapon/sword/IronSword.js";
import ArrowRain from "../resources/item/spell/ArrowRain.js";
import { Fight } from "../structures/battle/Fight.js";
import { Hit } from "../structures/battle/actions/Hit.js";
import { Logger } from "../structures/static/Logger.js";
import { Action } from "../structures/battle/actions/Action.js";
import { WebhookClient } from "discord.js";

const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1321956666031472660/mhQqugeo56FXCRW-QMvcQSmYx0DIh5F_6Y8e1IBuTDyB-fxYd1UTys67MDg3pUto9S8G"
})

async function send(msg: string) {
    //await webhook.send(msg)
}

NekoDatabase.getPlayerById("123").then(async p1 => {
    if (p1.inventory.items.length === 1) {
        const itm = await p1.inventory.addItem({
            itemId: ArrowRain.id,
            amount: 1,
            equipped: true
        })
        
        console.log(itm)
    }

    console.log(p1.getSpells()[0].info())

    await setTimeout(5000)
    
    const p2 = await NekoDatabase.getPlayerById("321")
    const p3 = await NekoDatabase.getPlayerById("4321")

    p1.data.username = "One"
    p2.data.username = "Two"
    p3.data.username = "Three"

    const fight = new Fight([
        [ p1 ],
        [ p2, p3 ]
    ])

    fight.on("round", async () => {
        const log = fight.getActionLog()
        console.log(Action.format(log))
        await send(`\n\nROUND ${fight.round}\n${Action.format(log)}`)
    })

    await fight.start()

    console.log("END")
    console.log("WINNER TEAM: ", fight.getWinnerTeam()?.map(x => x.displayName) ?? "NOBODY")
})