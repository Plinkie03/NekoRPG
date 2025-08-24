import { Player, PlayerInventoryItem, SpellItem } from '@nekorpg'

export class PlayerSpells {
	public static readonly MaxSpells = 3

	public constructor(public readonly player: Player) {}

	public get equipped() {
		return this.player.inventory.items.filter(
			(x) => x.equipped && x.item instanceof SpellItem
		) as PlayerInventoryItem<SpellItem>[]
	}

	public get full() {
		return this.equipped.length >= PlayerSpells.MaxSpells
	}
}
