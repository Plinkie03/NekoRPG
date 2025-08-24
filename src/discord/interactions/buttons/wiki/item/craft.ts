import { ArgType, CraftResponse, Interaction, InteractionType } from '@nekorpg'

export default new Interaction({
	id: 11,
	type: InteractionType.Button,
	args: [
		{
			type: ArgType.Item,
			required: true,
		},
	],
	execute(ctx) {
		return CraftResponse.execute(ctx, ctx.args[0])
	},
})
