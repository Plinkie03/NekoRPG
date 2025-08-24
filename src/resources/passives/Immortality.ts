import { Hit, Passive } from '@nekorpg'

export default new Passive({
	id: 2,
	name: 'Immortality',
	description:
		'A fatal hit will cause you to survive with 1 HP left. Can only occur once per battle.',
	cooldown: -1,
	actions: [Hit],
	validate(ctx) {
		return ctx.action.isFatal()
	},
	execute(ctx) {
		ctx.action.setNeverFatal()
		return true
	},
})
