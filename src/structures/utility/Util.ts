import {
	ActionRowBuilder,
	AnyComponentBuilder,
	ButtonBuilder,
} from '@discordjs/builders'
import { ClassType, Identifiable, Nameable } from '@nekorpg'
import { ComponentBuilder } from 'discord.js'

export class Util {
	private constructor() {}

	public static isChance(ch: number) {
		return Math.random() <= ch
	}

	public static getTotalPages(totalItems: number, itemsPerPage = 4): number {
		return Math.ceil(totalItems / itemsPerPage)
	}

	public static getPageIndexes(page: number, itemsPerPage = 4) {
		return [
			page * itemsPerPage - itemsPerPage,
			page * itemsPerPage,
		] as const
	}

	public static isClass<T extends ClassType>(x: any, y: T) {
		return x.constructor === y
	}

	public static isChildOfClass<T extends ClassType>(x: any, y: T) {
		return x instanceof y
	}

	public static splitComponents(comps: AnyComponentBuilder[]) {
		const rows = new Array<ActionRowBuilder<any>>()

		for (let i = 0; i < comps.length; i++) {
			const comp = comps[i]

			if (!rows.at(-1)) {
				rows.push(new ActionRowBuilder())
			}

			rows.at(-1)!.addComponents(comp)

			if (
				rows.at(-1)!.components.length === 5 &&
				i + 1 !== comps.length
			) {
				rows.push(new ActionRowBuilder())
			}
		}

		return rows
	}

	public static searchMany<K, V extends Nameable, Output = V>(
		arr: Map<K, V> | Array<V>,
		query: string,
		mapper?: (el: V) => Output
	): Output[] {
		query = query.toLowerCase()
		const id = Number(query)

		const out = new Array<Output>()

		for (const element of arr.values()) {
			if (
				element.id === id ||
				element.name.toLowerCase().includes(query)
			) {
				out.push(mapper?.(element) ?? (element as unknown as Output))
			}
		}

		return out
	}

	public static searchOne<K, V extends Nameable, Output = V>(
		...params: Parameters<typeof Util.searchMany<K, V, Output>>
	) {
		return Util.searchMany(...params)[0] ?? null
	}
}
