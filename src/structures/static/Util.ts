import { Collection } from "discord.js"
import { Identifiable } from "./Game.js"

export class Util {
    private constructor() { }

    public static isChance(ch: number) {
        return Math.random() * 100 <= ch
    }

    public static searchMany<T extends Identifiable>(
        elements: Collection<unknown, T> | T[],
        query: string,
        key?: keyof {
            [P in keyof T as T[P] extends string ? P : never]: never
        }
    ): T[] {
        query = query.toLowerCase()

        const arr = elements instanceof Map ? Array.from(elements.values()) : elements
        const results = new Array<T>()

        const lookupId = Number(query)

        for (let i = 0, len = arr.length; i < len; i++) {
            const el = arr[i]

            if (el.id === lookupId || el.name.toLowerCase().startsWith(query) || (key && (<string>el[key]).toLowerCase().startsWith(query))) {
                results.push(el)
            }
        }

        return results
    }

    public static searchOne<T extends Identifiable>(...params: Parameters<typeof this.searchMany<T>>) {
        return Util.searchMany(...params)
    }

    public static plural(of: string, n: number, add?: string) {
        return `${n} ${n === 1 ? of : of + (add ?? "s")}`
    }

    public static objectKeys<T extends object>(t: T) {
        return Object.keys(t) as (keyof T)[]
    }

    public static camelToTitle(str: string): string {
        const result = str.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }
}