import { ActionRowBuilder, AnyComponentBuilder, ApplicationCommandOptionChoiceData, BaseSelectMenuBuilder, CDNRoutes, Collection, ComponentBuilder, ImageFormat, InteractionReplyOptions, parseEmoji, RepliableInteraction, RouteBases } from "discord.js"
import { Identifiable } from "./Game.js"
import { Resource } from "../resource/Resource.js"
import { Stats } from "../entity/EntityBaseStats.js"
import { Nullable } from "../resource/Item.js"
import { argv } from "process"
import { Logger } from "./Logger.js"

export class Util {
    private constructor() { }

    public static isChance(ch: number) {
        return Math.random() * 100 <= ch
    }

    public static searchMany<T>(
        elements: undefined | Collection<unknown, T> | T[],
        query: string,
        id: (el: T) => number,
        name: (el: T) => string
    ): T[] {
        const results = new Array<T>()
        
        if (!elements) return results

        query = query.toLowerCase()

        const arr = elements instanceof Map ? Array.from(elements.values()) : elements

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

    public static addPoint(str: string) {
        return `- ${str}`
    }

    public static formatInt(n: number) {
        return Math.floor(n).toLocaleString()
    }

    public static formatFloat(n: number) {
        return n.toFixed(2).replace(/.00$/, "")
    }

    public static getEmojiUrl(emoji?: Nullable<string>) {
        if (!emoji) return null
        const em = parseEmoji(emoji)!

        return RouteBases.cdn + CDNRoutes.emoji(em.id!, em.animated ? ImageFormat.GIF : ImageFormat.PNG) + "?size=1024"
    }

    public static formatItemAmount(n: number) {
        return n === 1 ? "" : `${Util.formatInt(n)}x`
    }

    public static plural(of: string, n: number, add?: string, skip = false) {
        return `${!skip && `${Util.formatInt(n)} ` || ""}${n === 1 ? of : of + (add ?? "s")}`
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

    public static reply(interaction: RepliableInteraction<'cached'>, options: InteractionReplyOptions) {
        if (Util.isDevBuild()) 
            delete options.ephemeral

        return interaction[(interaction.replied ? "editReply" : interaction.isModalSubmit() && interaction.isFromMessage() ? "update" : interaction.isButton() ? "update" : "reply") as "reply"](options)
    }

    public static createActionRows<T, O extends AnyComponentBuilder>(using: T[], builder: (el: T) => O): ActionRowBuilder<O>[] {
        const rows = new Array<ActionRowBuilder<O>>(new ActionRowBuilder<O>())

        for (const el of using) {
            const got = builder(el) as O
            const row = rows.at(-1)!
            row.addComponents(got)

            if (row.components.length === 5 || (got instanceof BaseSelectMenuBuilder))
                rows.push(new ActionRowBuilder())
        }

        return rows.filter(x => !!x.components.length)
    }

    public static getPageCount(total: number, perPage = 10) {
        const pageCount = Math.floor(total / perPage)

        // We add 1 if the number is not equal to x0
        return total % perPage !== 0 ? pageCount + 1 : pageCount
    }

    public static getPageStart(page: number, perPage = 10) {
        return page * perPage - perPage
    }

    public static getPageEnd(page: number, perPage = 10) {
        return page * perPage
    }

    public static getPageNumber(index: number, perPage = 10) {
        // Since its an index, it starts from 0, so we increase by one
        index++

        const pageNumber = Math.floor(index / perPage)
        return index % perPage !== 0 ? pageNumber + 1 : pageNumber
    }

    public static isDevBuild() {
        return argv.at(2)?.endsWith("dev") ?? false
    }
}