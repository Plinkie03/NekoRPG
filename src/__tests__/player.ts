import NekoDatabase from "../core/NekoDatabase.js";
import IronSword from "../resources/item/gear/iron/IronSword.js";
import { Logger } from "../structures/static/Logger.js";

NekoDatabase.getPlayer("123").then(async p => {
    await p.inventory.at(0)?.unequip()
    console.log(p.inventory.at(0)?.data)
    console.log(p.data)
})