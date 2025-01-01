import { Entity } from "../../entity/Entity.js";

export abstract class Action {
    public readonly actions = new Array<Action>()

    public constructor(public readonly entity: Entity) {}

    protected abstract get message(): string
    protected abstract execute(): Promise<void>

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

    public add(action: Action) {
        this.actions.push(action)
        return this
    }

    public addMany(...actions: Action[]) {
        actions.forEach(this.add.bind(this))
        return this
    }

    public async run() {
        await this.execute()
        this.actions.forEach(x => x.execute())
    }
}