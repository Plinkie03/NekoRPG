import { Formatters, Heal, SpellItem } from '@nekorpg'

const BaseHeal = 0.25
const HealPerLevel = 0.05

export default new SpellItem({
	id: 11,
	name: 'Heal',
	description: `Heals the caster for ${Formatters.percentual(
		BaseHeal
	)} (+${Formatters.percentual(HealPerLevel)}% per level) of their Max HP`,
	maxLevel: 5,
	cooldown: 10,
	requiresTarget: false,
	execute(ctx) {
		ctx.cast.add(Heal, {
			entity: ctx.entity,
			amount:
				ctx.entity.stats.modded.maxHealth *
				(BaseHeal + HealPerLevel * ctx.cast.spell.level),
		})

		return true
	},
})
