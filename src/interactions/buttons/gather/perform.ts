import {
	ArgType,
	GatherResponse,
	Interaction,
	InteractionType,
	SkillType,
} from '@nekorpg'

export default new Interaction({
	id: 7,
	type: InteractionType.Button,
	args: [
		{
			type: ArgType.Enum,
			required: true,
			enum: SkillType,
		},
	],
	execute(ctx) {
		return GatherResponse.execute(ctx, ctx.args[0])
	},
})
