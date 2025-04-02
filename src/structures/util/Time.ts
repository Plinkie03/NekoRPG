import { Static } from "./Static.js";

export class Time extends Static {
    public static seconds(n: number) {
        return n * 1_000
    }

    public static minutes(n: number) {
        return Time.seconds(n * 60)
    }

    public static hours(n: number) {
        return Time.minutes(n * 60)
    }

    public static days(n: number) {
        return Time.hours(n * 24)
    }

    public static weeks(n: number) {
        return Time.days(n * 7)
    }
}