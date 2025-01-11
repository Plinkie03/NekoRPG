import { Entity } from "../../entity/Entity.js";
import { Nullable } from "../../resource/Item.js";
import { ItemPassiveBasePayload, ItemPassiveExecutePayload } from "../../resource/ItemPassive.js";

export abstract class Action {
    public readonly actions = new Array<Action>()

    public constructor(public readonly entity: Entity) {}

    protected abstract get message(): string
    protected abstract execute(): Promise<void>

    protected prepare() {}

    protected get entities(): Entity[] {
        return [ this.entity ]
    }

    public static format(actions: Action[], spacing = 1): string {
        return actions.map(
            x => {
                const msg = x.message
                return [
                    `${(spacing === 1 ? "" : " ".repeat(spacing + 1)) + "- "}${msg[0].toUpperCase() + msg.slice(1)}`,
                    Action.format(x.actions as Action[], spacing + 1)
                ].filter(Boolean).join("\n")
            }
        ).join("\n")
    }

    public add(action: Nullable<Action>) {
        if (action) 
            this.actions.push(action)
        return this
    }

    public addMany(...actions: Nullable<Action>[]) {
        actions.forEach(this.add.bind(this))
        return this
    }

    public async run() {
        this.prepare()

        for (const entity of this.entities) {
            for (const gear of entity.getEquipment()) {
                for (const passive of gear.item.passives) {
                    const payload: ItemPassiveExecutePayload = { passive, action: this, entity }

                    if (entity.moddedStats.canTriggerPassive(payload) && passive.data.execute(payload)) {
                        entity.moddedStats.addPassiveItemCooldown(passive)
                    }
                }
            }
        }

        await this.execute()

        for (const action of this.actions) {
            await action.run()
        }
    }
}