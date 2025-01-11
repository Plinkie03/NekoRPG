import { Fight } from "../battle/Fight.js";
import { PlayerInventoryItem } from "../player/PlayerInventoryItem.js";
import { SpellItem, SpellExecutionPayload, ItemType } from "../resource/Item.js";
import { Game } from "../static/Game.js";
import { Entity } from "./Entity.js";

export class EntitySpell {
    public constructor(
        public readonly entity: Entity,
        private readonly spellId: number,
        public readonly multiplier: number
    ) {}

    public get item() {
        return Game.Items.get(this.spellId) as SpellItem
    }

    public canCast() {
        return this.entity.moddedStats.canCastSpell(this)
    }

    public cast(payload: Omit<SpellExecutionPayload, "spell">) {
        this.item.data.execute({
            ...payload,
            spell: this
        })

        this.entity.moddedStats.addSpellCooldown(this)
    }

    public static from(data: PlayerInventoryItem<ItemType.Spell>) {
        return new EntitySpell(data.entity, data.item.id, data.multiplier)
    }

    public info() {
        return this.item.data.info(this)
    }
}