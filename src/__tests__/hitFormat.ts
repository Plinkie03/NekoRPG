import NekoDatabase from "../core/NekoDatabase.js";
import { Action } from "../structures/battle/actions/Action.js";
import { Hit } from "../structures/battle/actions/Hit.js";
import { Info } from "../structures/battle/actions/Info.js";

NekoDatabase.getPlayerById("123").then(async p => {
    const hit = Hit.from(p, p)
    hit.add(new Info(p, "ur gay"))
    console.log(Action.format([ hit ]))
})