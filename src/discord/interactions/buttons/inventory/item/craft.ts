import {
	ArgType,
	CraftResponse,
	GearItem,
	GearManagementResponse,
	GearType,
	Interaction,
	InteractionType,
	PlayerInventoryItem,
} from '@nekorpg'

export default new Interaction({
	id: 10,
	type: InteractionType.Button,
	args: [
		{
			type: ArgType.InventoryItem,
			required: true,
		},
	],
	execute(ctx) {
		return CraftResponse.execute(ctx, ctx.args[0])
	},
})
