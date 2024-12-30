import { Entity } from "../../entity/Entity.js";
import { Action } from "./Action.js";

export class Info extends Action {
    public constructor(
        entity: Entity,
        private readonly msg: string
    ) {
        super(entity)
    }

    protected get message(): string {
        return this.msg
    }

    protected execute(): void {
        
    }
}