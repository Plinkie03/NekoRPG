import { Zone } from "../../structures/resource/Zone.js";
import BirchForestNode from "../node/woodcutting/BirchForestNode.js";

export default new Zone({
    id: 1,
    name: "Slime Field",
    emoji: "<:slimefield:1323440260616687762>",
    description: "The field were beginners are born",
    nodes: [
        BirchForestNode
    ]
})