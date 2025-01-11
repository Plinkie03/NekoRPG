import { Zone } from "../../structures/resource/Zone.js";
import Slime from "../monster/Slime.js";
import SlimeQueen from "../monster/SlimeQueen.js";
import CoalCaveNode from "../node/mining/CoalCaveNode.js";
import IronCaveNode from "../node/mining/IronCaveNode.js";
import BirchForestNode from "../node/woodcutting/BirchForestNode.js";

export default new Zone({
    id: 1,
    name: "Slime Field",
    emoji: "<:slimefield:1323440260616687762>",
    description: "The field were beginners are born",
    nodes: [
        BirchForestNode,
        CoalCaveNode,
        IronCaveNode
    ],
    monsters: [
        Slime,
        SlimeQueen
    ]
})