import { Action } from "@prisma/client/runtime/library";
import { Resource, ResourceData } from "./Resource.js";
import { PlayerInventoryItem } from "../player/PlayerInventoryItem.js";

export interface ItemPassiveBasePayload {
    passive: ItemPassive
    item: PlayerInventoryItem
}

export interface ItemPassiveExecutePayload extends ItemPassiveBasePayload {
    action: Action
}

export interface ItemPassiveData extends ResourceData {
    cooldown: number
    criteria(payload: ItemPassiveBasePayload): boolean
    info(payload: ItemPassiveBasePayload): void
    execute(payload: ItemPassiveExecutePayload): boolean
}

export class ItemPassive extends Resource<ItemPassiveData> {}