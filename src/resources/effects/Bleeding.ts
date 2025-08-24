import { AilmentDamage, Effect, Formatters, Hit } from '@nekorpg'

const Multiplier = 0.05

export default new Effect({
	id: 1,
	name: 'Bleeding',
	description: `Lowers the entity's HP by ${Formatters.percentual(
		Multiplier
	)} every round.`,
	emoji: '<:bleeding:1408841211833483365>',
	tick(ctx) {
		ctx.round!.add(AilmentDamage, {
			text: `${ctx.entity} is bleeding!`,
			entity: ctx.entity,
			damage:
				ctx.entity.stats.modded.maxHealth * (Multiplier * ctx.stacks),
		})
		return true
	},
})
