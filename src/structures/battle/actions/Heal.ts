import { Entity } from "../../entity/Entity.js";
import { Action } from "./Action.js";

export class Heal extends Action {
    private readonly quantity: number

    public constructor(entity: Entity, quantity: number) {
        super(entity)
        this.quantity = Math.floor(quantity * (entity.moddedStats.healRate / 100))
    }

    protected get message(): string {
        return `${this.entity.displayName} has healed by ${this.quantity}!`
    }

    protected async execute() {
        this.entity.heal(this.quantity)
    }
}