import { UnreachableError, Util } from '@nekorpg'

export enum RarityType {
	Common,
	Uncommon,
	Rare,
	Epic,
	Legendary,
	Mythic,
	Angelic,
	Celestial,
	Eternal,
	Infinity,
	Riftborn,
}

export interface IRarityData {
	multiplier: [number, number]
	chance: number
}

export class Rarity {
	private static readonly Data = new Map<RarityType, IRarityData>([
		[RarityType.Riftborn, { multiplier: [10, 100], chance: 0.0001 }],
		[RarityType.Infinity, { multiplier: [7, 10], chance: 0.001 }],
		[RarityType.Eternal, { multiplier: [5.5, 7], chance: 0.002 }],
		[RarityType.Celestial, { multiplier: [4, 5.5], chance: 0.005 }],
		[RarityType.Angelic, { multiplier: [3, 4], chance: 0.01 }],
		[RarityType.Mythic, { multiplier: [2.5, 3], chance: 0.02 }],
		[RarityType.Legendary, { multiplier: [2, 2.5], chance: 0.05 }],
		[RarityType.Epic, { multiplier: [1.6, 1.8], chance: 0.1 }],
		[RarityType.Rare, { multiplier: [1.4, 1.6], chance: 0.25 }],
		[RarityType.Uncommon, { multiplier: [1.2, 1.4], chance: 0.5 }],
		[RarityType.Common, { multiplier: [1, 1.2], chance: 1 }],
	])

	public static get(type: RarityType) {
		return Rarity.Data.get(type)!
	}

	public static random(mult: number = 1) {
		for (const [type, data] of Rarity.Data) {
			if (Util.isChance(data.chance * mult)) {
				return [type, data] as const
			}
		}

		throw new UnreachableError()
	}
}
