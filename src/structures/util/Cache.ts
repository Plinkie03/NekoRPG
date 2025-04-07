import { TypedEmitter } from 'tiny-typed-emitter';

export interface ICacheValue<T> {
    value: T,
    expiresAt: number,
}

export interface ICacheEvents<K, V> {
    expire: (key: K, value: V) => void;
}

export class Cache<K, V> extends TypedEmitter<ICacheEvents<K, V>> {
    public static readonly DefaultLifetime = 60_000;

    private readonly holds = new Map<K, ICacheValue<V>>();

    public constructor(private readonly lifetime = Cache.DefaultLifetime) {
        super();

        setTimeout(this._checkup.bind(this), this.lifetime);
    }

    private _checkup() {
        for (const [ key, value ] of this.holds) {
            if (this._isExpired(value)) {
                this.holds.delete(key);
                this.emit('expire', key, value.value);
            }
        }
    }

    private _isExpired(v?: ICacheValue<V>) {
        return !!v && Date.now() >= v.expiresAt;
    }

    public has(key: K) {
        return this.holds.has(key);
    }

    public set(key: K, value: V) {
        this.holds.set(key, {
            expiresAt: Date.now() + this.lifetime,
            value,
        });
    }

    public get(key: K) {
        return this.holds.get(key)?.value;
    }

    public delete(key: K) {
        this.holds.delete(key);
    }
}