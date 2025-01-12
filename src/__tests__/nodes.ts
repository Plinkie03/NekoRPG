import { setTimeout } from "timers/promises";
import NekoDatabase from "../core/NekoDatabase.js";
import IronSword from "../resources/item/gear/iron/IronSword.js";
import BirchForestNode from "../resources/node/woodcutting/BirchForestNode.js";
import { Logger } from "../structures/static/Logger.js";
import { inspect } from "util";
import { NodeAction } from "../structures/resource/node/Node.js";

NekoDatabase.getPlayerById("123").then(async p => {
    console.log(
        await p.tasks.start(BirchForestNode)
    )

    await setTimeout(1000)

    console.log(
        inspect(await p.tasks.finish(NodeAction.Woodcutting), { colors: true, depth: 3 })
    )
})