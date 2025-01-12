import { Node, NodeAction } from "./Node.js";

export class WoodcuttingNode extends Node {
    public get type() {
        return NodeAction.Woodcutting
    }
}