import { Nullable } from '@nekorpg'
import { TypedEmitter } from 'tiny-typed-emitter'

export interface ICacheEntry<V> {
	value: V
	lastAccessedTimestamp: number
}

export interface ICacheEvents<K, V> {
	expire: (key: K, value: V) => any
}

export class Cache<K, V> extends TypedEmitter<ICacheEvents<K, V>> {
	private static readonly _SweepTimer = 60_000
	private readonly _map = new Map<K, ICacheEntry<V>>()

	public constructor(
		public readonly _duration = 60_000,
		sweepTimer = Cache._SweepTimer
	) {
		super()
		setInterval(this._sweep.bind(this), sweepTimer)
	}

	public set(key: K, value: V) {
		this._map.set(key, {
			lastAccessedTimestamp: Date.now(),
			value,
		})
	}

	public get(key: K): Nullable<V> {
		const data = this._map.get(key)
		if (!data) {
			return null
		} else if (this._isOld(data)) {
			this._expire(key)
			return null
		} else {
			data.lastAccessedTimestamp = Date.now()
			return data.value
		}
	}

	private _sweep() {
		for (const [key, entry] of this._map) {
			if (this._isOld(entry)) {
				this._expire(key)
			}
		}
	}

	private _isOld(data: ICacheEntry<V>) {
		return data.lastAccessedTimestamp + this._duration - Date.now() <= 0
	}

	private _expire(key: K) {
		const value = this._map.get(key)!.value
		this._map.delete(key)
		this.emit('expire', key, value)
	}
}
