import { Collection } from "discord.js"
import { Identifiable } from "../structures/static/Game.js"
import { NekoResources } from "./NekoResources.js"
import { Util } from "../structures/static/Util.js"
import { Logger } from "../structures/static/Logger.js"

export class NekoResourceCache<T extends Identifiable> {
    public readonly raw = new Array<T>()
    public readonly collection: Collection<number, T> = new Collection()

    public constructor(...many: T[]) {
        this.set(...many)
    }

    public set(...many: T[]) {
        for (const one of many) {
            if (this.collection.has(one.id)) {
                throw new Error(`${one.id} is already in the cache! For instance type ${one.constructor.name} (Valid ID: ${this.getValidId()})`)
            }

            this.raw.push(one)
            this.collection.set(one.id, one)
        }
        
        Logger.info(`Loaded ${this.raw.length} elements of type ${this.raw[0]?.constructor.name}`)
    }

    public get(id: number) {
        const el = this.collection.get(id)

        if (!el) throw new Error(`${id} does not exist on ${this.raw[0]?.constructor.name}!`)

        return el
    }

    public search(query: string) {
        return Util.searchMany(
            this.raw,
            query,
            el => el.id,
            el => "name" in el ? el.name!.toString() : `${el}`
        )
    }

    public static async fromPath<T extends Identifiable>(path: string) {
        return new this(...(await NekoResources.loadAll<T>(path)))
    }

    public getValidId() {
        return (this.raw.sort((x, y) => x.id - y.id).at(-1)?.id ?? 0) + 1
    }
}