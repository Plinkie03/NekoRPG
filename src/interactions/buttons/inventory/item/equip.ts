import {
	ArgType,
	GearItem,
	GearManagementResponse,
	Interaction,
	InteractionType,
	PlayerInventoryItem,
} from '@nekorpg'

export default new Interaction({
	id: 8,
	type: InteractionType.Button,
	args: [
		{
			type: ArgType.InventoryItem,
			required: true,
		},
	],
	execute(ctx) {
		return GearManagementResponse.equip(
			ctx,
			ctx.args[0] as PlayerInventoryItem<GearItem>
		)
	},
})
