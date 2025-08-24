import { Formulas } from '@nekorpg'

export type EnumLike<T = any> = {
	[id: string]: T | string
	[nu: number]: string
}

export type GetEnum<T> = T extends EnumLike<infer P> ? P : never

export class Enum {
	private constructor() {}

	public static keys<T extends EnumLike>(en: T) {
		return Object.keys(en).filter((x) => isNaN(Number(x))) as Array<keyof T>
	}

	public static values<T extends EnumLike>(en: T) {
		return Object.values(en).filter((x) => !isNaN(x)) as Array<GetEnum<T>>
	}

	public static entries<T extends EnumLike>(en: T) {
		return Object.entries(en).filter(
			(x) => typeof x[1] === 'number'
		) as Array<[keyof T, GetEnum<T>]>
	}

	public static parse<T extends EnumLike>(en: T, key: keyof T) {
		return en[key] as GetEnum<T>
	}

	public static unsafeParse<T extends EnumLike>(en: T, key: string) {
		return en[key] as GetEnum<T>
	}

	public static random<T extends EnumLike>(en: T, ...exclude: GetEnum<T>[]) {
		const arr = Enum.values(en).filter((x) => !exclude?.includes(x))
		return arr[Formulas.randomInt(arr.length)]
	}
}
