import NekoDatabase from "../core/NekoDatabase.js";
import IronSword from "../resources/item/gear/iron/IronSword.js";
import BirchLog from "../resources/item/material/log/BirchLog.js";
import { Logger } from "../structures/static/Logger.js";

NekoDatabase.getPlayerById("1096285761365610576").then(async p => {
    await p.inventory.addItem({ itemId: BirchLog.id, amount: 100 })
})