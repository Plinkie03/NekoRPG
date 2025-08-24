import { EntitySpell, Player, PlayerInventoryItem, SpellItem } from '@nekorpg'

export class PlayerSpell extends EntitySpell<Player> {
	public constructor(
		player: Player,
		public readonly inventoryItem: PlayerInventoryItem<SpellItem>
	) {
		super(player, inventoryItem.item, 1)
	}
}
