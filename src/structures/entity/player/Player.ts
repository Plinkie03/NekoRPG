import { RawPlayerData } from "../../../core/NekoDatabase.js";
import { Entity } from "../base/Entity.js";

export class Player extends Entity {
    public constructor(public readonly data: RawPlayerData) {
        super()
    }

    public get id(): string {
        return this.data.id
    }

    public get name(): string {
        return this.data.username
    }
}