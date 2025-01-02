import { ItemType, SpellItem } from "../resource/Item.js";
import { Player } from "./Player.js";
import { PlayerInventoryItem } from "./PlayerInventoryItem.js";

export class PlayerSpells {
    public static readonly MaximumEquippedSpells = 3
    
    private spellCache?: PlayerInventoryItem<ItemType.Spell>[]
    
    public constructor(private readonly player: Player) {}

    public get equipped() {
        if (this.spellCache) return this.spellCache

        const spells = new Array<PlayerInventoryItem<ItemType.Spell>>()
        
        for (const invItem of this.player.inventory) {
            if (invItem.equipped && invItem.item.isSpell()) {
                spells.push(invItem as PlayerInventoryItem<ItemType.Spell>)
            }
        }

        return this.spellCache = spells
    }

    public isFull() {
        return this.equipped.length >= PlayerSpells.MaximumEquippedSpells
    }
    
    private clearCache() {
        delete this.spellCache
    }
}