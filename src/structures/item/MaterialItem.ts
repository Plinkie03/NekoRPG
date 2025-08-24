import { IBaseItemData, BaseItem } from '@nekorpg'

export interface IMaterialItemData extends IBaseItemData {
	price: number
}

export class MaterialItem extends BaseItem<IMaterialItemData> {}
