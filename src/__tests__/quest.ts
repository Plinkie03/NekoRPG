import NekoDatabase from "../core/NekoDatabase.js";
import IronSword from "../resources/item/gear/weapon/sword/IronSword.js";
import BirchLog from "../resources/item/material/log/BirchLog.js";
import SlimeBall from "../resources/item/material/other/SlimeBall.js";
import SlimeQuest from "../resources/quest/SlimeQuest.js";
import { Logger } from "../structures/static/Logger.js";

NekoDatabase.getPlayerById("1096285761365610576").then(async p => {
    console.log(p.quests.raw)
})