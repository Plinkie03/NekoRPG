import { EnumLike, GetEnum } from '../discord/BaseHandler.js';
import { Static } from './Static.js';

export class Enum extends Static {
    public static values<T extends EnumLike>(en: T) {
        return Object.values(en).filter(x => typeof x === 'number') as GetEnum<T>[];
    }

    public static keys<T extends EnumLike>(en: T) {
        return Object.keys(en).filter(x => typeof x === 'string') as (keyof T)[];
    }

    public static parse<T extends EnumLike>(en: T, key: keyof T) {
        return this.unsafeParse(en, key as string);
    }

    public static unsafeParse<T extends EnumLike>(en: T, key: string) {
        return en[key] as GetEnum<T>;
    }
}