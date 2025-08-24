import { AilmentDamage, Effect, Hit } from '@nekorpg'

export default new Effect({
	id: 2,
	name: 'Curse',
	emoji: '<:curse:1408923065387319466>',
	description:
		'During the effect, the target will suffer immediate death if attempting to attack the caster',
	actions: [Hit],
	tick(ctx) {
		ctx.action!.add(AilmentDamage, {
			entity: ctx.entity,
			damage: ctx.entity.health,
			text: `${ctx.entity} broke the curse...`,
		})
		return true
	},
})
