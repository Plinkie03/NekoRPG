import NekoDatabase from "../core/NekoDatabase.js";
import IronSword from "../resources/item/gear/iron/IronSword.js";
import { Logger } from "../structures/static/Logger.js";

NekoDatabase.getPlayerById("123").then(async p => {
    console.log(p.inventory.items.map(x => x.detailedName() + x.detailedAmount).join("\n"))
})