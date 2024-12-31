import { ApplicationCommandOptionChoiceData, CDNRoutes, Collection, ImageFormat, parseEmoji, RouteBases } from "discord.js"
import { Identifiable } from "./Game.js"
import { Resource } from "../resource/Resource.js"
import { Nullable } from "../resource/Item.js"
import { Stats } from "../entity/EntityBaseStats.js"

export class Util {
    private constructor() { }

    public static isChance(ch: number) {
        return Math.random() * 100 <= ch
    }

    public static searchMany<T>(
        elements: Collection<unknown, T> | T[],
        query: string,
        id: (el: T) => number,
        name: (el: T) => string
    ): T[] {
        query = query.toLowerCase()

        const arr = elements instanceof Map ? Array.from(elements.values()) : elements
        const results = new Array<T>()

        const lookupId = Number(query)

        for (let i = 0, len = arr.length; i < len; i++) {
            const el = arr[i]


            if (id(el) === lookupId || name(el).toLowerCase().startsWith(query)) {
                results.push(el)
            }
        }

        return results
    }

    public static searchOne<T extends Identifiable>(...params: Parameters<typeof this.searchMany<T>>) {
        return Util.searchMany(...params)
    }

    public static getEmojiUrl(emoji?: Nullable<string>) {
        if (!emoji) return null
        const em = parseEmoji(emoji)!

        return RouteBases.cdn + CDNRoutes.emoji(em.id!, em.animated ? ImageFormat.GIF : ImageFormat.PNG) + "?size=1024"
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

    public static formatChoices<T>(
        arr: Collection<any, T> | T[],
        key: (itm: T) => string,
        value: (itm: T) => string | number
    ): ApplicationCommandOptionChoiceData[] {
        return [...arr.values()].map(x => ({
            name: key(x),
            value: value(x)
        }))
    }

    public static formatResourceChoices(resources: Parameters<typeof Util.formatChoices<Resource>>[0]) {
        return this.formatChoices(
            resources,
            el => el.name,
            el => el.id
        )
    }

    public static getStatsFrom(instance: unknown & { getStat(stat: keyof Stats): number }): Stats {
        return {
            blockRate: instance.getStat("blockRate"),
            blockReduction: instance.getStat("blockReduction"),
            criticalMultiplier: instance.getStat("criticalMultiplier"),
            criticalRate: instance.getStat("criticalRate"),
            dodgeRate: instance.getStat("dodgeRate"),
            healRate: instance.getStat("healRate"),
            lifesteal: instance.getStat("lifesteal"),
            defense: Math.floor(instance.getStat("defense")),
            agility: Math.floor(instance.getStat("agility")),
            maxHealth: Math.floor(instance.getStat("maxHealth")),
            strength: Math.floor(instance.getStat("strength"))
        }
    }
}