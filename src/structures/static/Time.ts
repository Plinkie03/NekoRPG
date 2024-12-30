export class Time {
    private constructor() {}

    public static seconds(n: number) {
        return n * 1e3
    }

    public static minutes(n: number) {
        return n * Time.seconds(60)
    }

    public static hours(n: number) {
        return n * Time.minutes(60)
    }

    public static days(n: number) {
        return n * Time.hours(24)
    }

    public static weeks(n: number) {
        return n * Time.days(7)
    }
}
