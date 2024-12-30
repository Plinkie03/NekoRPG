import { EntityBaseStats, Stats } from "../entity/EntityBaseStats.js";
import { EquippableItem, GearItem, GearType, ItemType } from "../resource/Item.js";
import { Util } from "../static/Util.js";
import { Player } from "./Player.js";
import { PlayerInventoryItem } from "./PlayerInventoryItem.js";

export type EquippedGear = {
    [P in GearType]: PlayerInventoryItem<ItemType.Gear>
}

export class PlayerGear {
    private gearCache?: Partial<EquippedGear>
    private statCache?: Stats

    public constructor(private readonly player: Player) {}

    public get equipped() {
        if (this.gearCache) return this.gearCache

        const gear: Partial<EquippedGear> = {}

        for (const invItem of this.player.inventory) {
            if (invItem.equipped && invItem.item.isGear()) {
                gear[invItem.item.gearType!] = invItem as PlayerInventoryItem<GearItem["type"]>
            }  
        }
        
        return this.gearCache = gear
    }

    public get stats() {
        if (this.statCache) return this.statCache

        const stats: Stats = EntityBaseStats.createEmptyStats()

        for (const gearType of Util.objectKeys(this.equipped)) {
            const invItem = this.equipped[gearType]!

            for (const key of Util.objectKeys(stats)) {
                stats[key] += invItem[key]
            }
        }

        return stats
    }

    private clearCache() {
        delete this.gearCache
        delete this.statCache
    }

    public toArray() {
        return Object.values(this.equipped)
    }
}