import { FileScheme, NoImageFound, Nullable } from '@nekorpg'
import { parseEmoji, CDNRoutes, ImageFormat } from 'discord.js'
import { readdirSync } from 'fs'
import { join, resolve } from 'path'

export interface IResourceData<Id> {
	id: Id
	name: string
	description?: string
	emoji?: string
}

export interface Identifiable {
	id: number
}

export interface Nameable extends Identifiable {
	name: string
}

export abstract class Resource<
	Id extends number | string,
	T extends IResourceData<Id>
> {
	private static readonly _Path = join('dist', 'resources')

	public constructor(public readonly data: T) {}

	public get displayName() {
		return `${this.emoji ? `${this.emoji} ` : ''}${this.name}`
	}

	public get id() {
		return this.data.id
	}

	public get name() {
		return this.data.name
	}

	public get description() {
		return this.data.description ?? null
	}

	public get emoji() {
		return this.data.emoji ?? null
	}

	public get url() {
		return Resource.getEmojiUrl(this.data.emoji) ?? NoImageFound
	}

	public static getEmojiUrl(emoji?: Nullable<string>) {
		const emojiData = emoji && parseEmoji(emoji)
		return emojiData
			? 'https://cdn.discordapp.com' +
					CDNRoutes.emoji(
						emojiData.id!,
						emojiData.animated ? ImageFormat.GIF : ImageFormat.PNG
					)
			: null
	}

	public static async load<T extends Identifiable>(path: string) {
		path = join(Resource._Path, path)
		const loaded = new Array<T>()

		for (const file of readdirSync(path, {
			recursive: true,
			withFileTypes: true,
		}).filter((x) => x.isFile())) {
			const resource = await import(
				FileScheme + resolve(file.parentPath, file.name)
			).then((x) => x.default as T)
			loaded.push(resource)
		}

		return loaded
	}

	public toString() {
		return this.displayName
	}
}
