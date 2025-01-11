import { Entity, IEntity } from "../../entity/Entity.js";
import { EntityBaseStats } from "../../entity/EntityBaseStats.js";
import { EntitySpell } from "../../entity/EntitySpell.js";
import { Action } from "./Action.js";

export class SpellCast extends Action {
    public constructor(
        attacker: Entity, 
        public readonly defender: Entity, 
        public readonly spell: EntitySpell
    ) {
        super(attacker)
    }

    protected get entities(): Entity<IEntity<any>, EntityBaseStats>[] {
        return [ ...super.entities, this.defender ]
    }

    protected get message(): string {
        return `${this.entity.displayName} used ${this.spell.item.simpleName}${this.spell.item.data.multitarget ?
                "" :
                ` on ${this.defender.displayName}`
            }:`
    }

    protected async execute() {}
}