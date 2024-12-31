import { Util } from "../static/Util.js"
import { Nullable } from "./Item.js"

export interface ResourceData {
    description?: Nullable<string>
    emoji?: Nullable<string>
    id: number
    name: string
}

export class Resource<Data extends ResourceData = ResourceData> {
    public constructor(public readonly data: Data) {}

    public get id() {
        return this.data.id
    }

    public get name() {
        return this.data.name
    }

    public get emoji() {
        return this.data.emoji ?? null
    }

    public get simpleName() {
        return `${this.emoji && `${this.emoji} ` || ''}${this.name}`
    }

    public get image() {
        return Util.getEmojiUrl(this.emoji)
    }
}