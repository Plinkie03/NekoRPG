import {
	Identifiable,
	Nameable,
	Resource,
	SkipFirstElement,
	Util,
} from '@nekorpg'

export class NekoResourceHolder<V extends Nameable> {
	private readonly _map = new Map<number, V>()
	private readonly _raw = new Array<V>()

	public constructor(private readonly _path: string) {}

	public async load() {
		const resources = await Resource.load<V>(this._path)
		this._raw.push(...resources)

		for (const resource of resources) {
			if (this._map.has(resource.id)) {
				throw new Error(
					`Resource with id ${resource.id} already exists in ${this._path}`
				)
			} else {
				this._map.set(resource.id, resource)
			}
		}

		console.log(`Loaded ${this._map.size} resources in ${this._path}`)
	}

	public get(id: number) {
		const res = this._map.get(id)
		if (!res) {
			throw new Error(`Resource with id ${id} not found in ${this._path}`)
		}
		return res
	}

	public searchMany<Output = V>(
		...params: SkipFirstElement<
			Parameters<typeof Util.searchMany<number, V, Output>>
		>
	) {
		return Util.searchMany(this._raw, ...params)
	}

	public searchOne<Output = V>(
		...params: SkipFirstElement<
			Parameters<typeof Util.searchOne<number, V, Output>>
		>
	) {
		return Util.searchOne(this._raw, ...params)
	}
}
