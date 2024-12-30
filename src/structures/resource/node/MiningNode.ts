import { Tasks } from "../../player/PlayerTasks.js";
import { Node } from "./Node.js";

export class MiningNode extends Node {
    public get type(): keyof Tasks {
        return "mining"
    }
}