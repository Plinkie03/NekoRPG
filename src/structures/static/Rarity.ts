import { Util } from "./Util.js"

export enum RarityType {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
    Mythical,
    Godly,
    Corrupted
}

export interface IRarity {
    chance: number
    type: RarityType
    multiplier: [ number, number ]
} 

export class Rarity {
    private static readonly Rarities: IRarity[] = [
        {
            type: RarityType.Corrupted,
            chance: 0.01,
            multiplier: [3, 4]
        },
        {
            type: RarityType.Godly,
            chance: 1,
            multiplier: [2.1, 2.5]
        },
        {
            type: RarityType.Mythical,
            chance: 2.5,
            multiplier: [2.1, 2.3]
        },
        {
            type: RarityType.Legendary,
            chance: 5,
            multiplier: [1.85, 2.1]
        },
        {
            type: RarityType.Epic,
            chance: 10,
            multiplier: [1.65, 1.85]
        },
        {
            type: RarityType.Rare,
            chance: 25,
            multiplier: [1.35, 1.6]
        },
        {
            type: RarityType.Uncommon,
            chance: 50,
            multiplier: [1.1, 1.35]
        },
        {
            type: RarityType.Common,
            chance: 100,
            multiplier: [0.9, 1.1]
        },
    ]

    private static readonly MappedRarities = new Map(Rarity.Rarities.map(x => [x.type, x]))

    private constructor() {}

    public static getRandom(multiplier: number = 1): IRarity {
        for (let i = 0;i < Rarity.Rarities.length;i++) {
            const rarity = Rarity.Rarities[i]
            if (!Util.isChance(rarity.chance * multiplier)) continue
            return rarity
        }

        throw new Error("Will not happen")
    }

    public static get(type: RarityType) {
        return Rarity.MappedRarities.get(type)!
    }
}