import { Monster } from "../monster/Monster.js";
import { Requirements } from "../static/Requirements.js";
import { RequirementData } from "./Item.js";
import { Node, SkipFirstArrayArg } from "./node/Node.js";
import { Resource, ResourceData } from "./Resource.js";

export interface ZoneData extends ResourceData {
    nodes?: Node[]
    monsters?: Monster[]
    requirements?: RequirementData
}

export class Zone extends Resource<ZoneData> {
    public get nodes() {
        return this.data.nodes
    }

    public get monsters() {
        return this.data.monsters
    }
    
    public hasRequirements(...args: SkipFirstArrayArg<Parameters<typeof Requirements.has>>) {
        return Requirements.has(this.data.requirements, ...args)
    }
}