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

    public static fromMany(entity: Entity, messages: string[]) {
        return messages.map(
            x => new Info(entity, x)
        )
    }

    protected async execute() {
        
    }

    public static new(entity: Entity, str: string) {
        return new this(entity, str)
    }
}