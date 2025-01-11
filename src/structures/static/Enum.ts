import { EnumLike, GetEnum } from "../discord/Shared.js"

export class Enum {
    private constructor() { }

    public static keys<T extends EnumLike>(en: T) {
        return Object.values(en).filter(x => typeof x === "string") as Array<keyof T>
    }

    public static values<T extends EnumLike>(en: T) {
        return Object.values(en).filter(x => typeof x === "number") as Array<GetEnum<T>>
    }

    public static entries<T extends EnumLike>(en: T) {
        return Object.entries(en).filter(x => typeof x[1] === "number") as Array<[keyof T, GetEnum<T>]>
    }
}