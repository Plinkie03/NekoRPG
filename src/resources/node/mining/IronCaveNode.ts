import { MiningNode } from "../../../structures/resource/node/MiningNode.js";
import BirchLog from "../../item/material/log/BirchLog.js";
import Coal from "../../item/material/ore/Coal.js";
import IronOre from "../../item/material/ore/IronOre.js";

export default new MiningNode({
    id: 3,
    name: "Iron Cave",
    emoji: "<:iron_cave:1324873345128337519>",
    resources: [
        {
            hardness: 1_500,
            item: IronOre,
            rewards: {
                skills: {
                    mining: 8
                }
            }
        }
    ],
})