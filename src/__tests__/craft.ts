import NekoDatabase from "../core/NekoDatabase.js";
import IronSword from "../resources/item/gear/iron/IronSword.js";
import Wood from "../resources/item/material/log/BirchLog.js";
import { Logger } from "../structures/static/Logger.js";

NekoDatabase.getPlayerById("123").then(async p => {
    await p.inventory.addItem({
        itemId: Wood.id,
        amount: 10
    })

    console.log(await IronSword.craft(p, 1), p.inventory.at(0)?.item.name, p.inventory.at(0)?.amount)
})