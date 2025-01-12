import { SkillType } from "../../../structures/player/PlayerSkills.js";
import { WoodcuttingNode } from "../../../structures/resource/node/WoodcuttingNode.js";
import BirchLog from "../../item/material/log/BirchLog.js";

export default new WoodcuttingNode({
    id: 1,
    name: "Birch Forest",
    emoji: "<:birchforest:1324081704352223293>",
    resources: [
        {
            hardness: 1e3,
            item: BirchLog,
            rewards: {
                skills: [
                    { type: SkillType.Woodcutting, xp: 5 }
                ],
            }
        }
    ],
})