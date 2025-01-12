import { SkillType } from "../../../structures/player/PlayerSkills.js";
import { MiningNode } from "../../../structures/resource/node/MiningNode.js";
import BirchLog from "../../item/material/log/BirchLog.js";
import Coal from "../../item/material/ore/Coal.js";

export default new MiningNode({
    id: 2,
    name: "Coal Cave",
    emoji: "<:coal_cave:1324872154369495082>",
    resources: [
        {
            hardness: 1e3,
            item: Coal,
            rewards: {
                skills: [
                    { type: SkillType.Mining, xp: 5 }
                ]
            }
        }
    ],
})