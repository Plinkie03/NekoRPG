import {
	ArgType,
	Enum,
	GatherResponse,
	Interaction,
	InteractionType,
	SkillType,
} from '@nekorpg'

export default new Interaction({
	id: 6,
	type: InteractionType.StringMenu,
	async execute(ctx) {
		await ctx.input.update(
			GatherResponse.display(ctx, Number(ctx.input.values[0]))
		)
		return true
	},
})
