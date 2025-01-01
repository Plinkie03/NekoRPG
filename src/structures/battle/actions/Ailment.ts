import { Entity } from "../../entity/Entity.js";
import { Effect } from "../../resource/Effect.js";
import { Action } from "./Action.js";

export class Ailment extends Action {
    private readonly damage: number

    public constructor(
        entity: Entity, 
        private readonly effect: Effect,
        damage: number
    ) {
        super(entity)
        this.damage = Math.floor(damage)
    }

    public static async run(...params: ConstructorParameters<typeof Ailment>) {
        const ailment = new Ailment(...params)
        await ailment.run()
        return ailment
    }

    protected get message(): string {
        return `${this.entity.displayName} has been damaged by ${this.effect.simpleName} (-${this.damage})!`
    }

    protected async execute() {
        this.entity.damage(this.damage)
    }
}