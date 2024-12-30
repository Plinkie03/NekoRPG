export class Formulas {
    private constructor() {}

    public static random(max: number): number
    public static random(min: number, max: number): number
    public static random(min: number, max?: number) {
        return max === undefined ? Math.random() * min : Math.random() * (max - min) + min
    }

    public static calculateReqXp(level: number, defaultValue: number, multiplier: number) {
        return Math.floor(defaultValue * (level ** multiplier))
    }

    public static calculateSkillMultiplier(level: number) {
        return 1 + level * Math.sqrt(level * 0.01)
    }
}