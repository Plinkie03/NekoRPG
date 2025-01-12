import { Node, NodeAction } from "./Node.js";

export class MiningNode extends Node {
    public get type() {
        return NodeAction.Mining
    }
}