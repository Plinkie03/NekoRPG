import {
	IBaseItemData,
	StatBuilder,
	RequirementBuilder,
	BaseItem,
} from '@nekorpg'

export enum GearType {
	Helmet,
	Chestplate,
	Boots,
	Necklace,
	Ring,
	Weapon,
	Shield,
}

export interface IGearItemData extends IBaseItemData {
	stats: StatBuilder
	gearType: GearType
	weaponType?: WeaponType
	requirements?: IBaseItemData['requirements'] & {
		equip?: RequirementBuilder
	}
}

export enum WeaponType {
	Sword,
	Bow,
	Wand,
}

export class GearItem extends BaseItem<IGearItemData> {
	public get stackable(): boolean {
		return false
	}

	public get stats() {
		return this.data.stats
	}

	public get gearType() {
		return this.data.gearType
	}

	public get weaponType() {
		return this.data.weaponType
	}
}
