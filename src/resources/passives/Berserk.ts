import { Formatters, Hit, Passive } from '@nekorpg'

const Multiplier = 0.01
const Limit = 0.5

export default new Passive({
	id: 1,
	actions: [Hit],
	name: 'Berserk',
	appendTag: false,
	description: `For every % of HP lost, DMG and DMG RES +${Formatters.percentual(
		Multiplier
	)} (Up to ${Formatters.percentual(Limit)})`,
	execute(ctx) {
		const mult = Math.max(
			Limit,
			ctx.entity.health / ctx.entity.stats.modded.maxHealth
		)

		if (this.isAttacker(ctx)) {
			ctx.action.damage /= mult
		} else {
			ctx.action.damage *= mult
		}

		return true
	},
})
