import {
	ArgType,
	GearItem,
	GearManagementResponse,
	GearType,
	Interaction,
	InteractionType,
	PlayerInventoryItem,
} from '@nekorpg'

export default new Interaction({
	id: 9,
	type: InteractionType.Button,
	args: [
		{
			type: ArgType.InventoryItem,
			required: true,
		},
	],
	execute(ctx) {
		return GearManagementResponse.unequip(
			ctx,
			ctx.args[0] as PlayerInventoryItem<GearItem>
		)
	},
})
