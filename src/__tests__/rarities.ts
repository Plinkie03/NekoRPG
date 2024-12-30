import { Logger } from "../structures/static/Logger.js";
import { Rarity, RarityType } from "../structures/static/Rarity.js";

let i = 0;
while (Rarity.getRandom().type !== RarityType.Corrupted) {
    i++
}

Logger.info(`Got the rarity after ${i.toLocaleString()} tries`)