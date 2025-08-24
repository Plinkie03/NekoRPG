import { ButtonStyle, Colors, ContainerBuilder } from 'discord.js'

import {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from '@discordjs/builders'
import {
	AnyDiscordContext,
	AnyDiscordUpdatableContext,
	PrimaryColor,
	SkillType,
} from '@nekorpg'
import choose from '../../interactions/menus/gather/choose.js'
import perform from '../../interactions/buttons/gather/perform.js'

export class GatherResponse {
	private constructor() {}

	public static display(ctx: AnyDiscordContext, skill?: SkillType) {
		const embed = new EmbedBuilder()
			.setColor(PrimaryColor)
			.setTitle('Gathering Time!')

		const components = new Array<
			| ActionRowBuilder<ButtonBuilder>
			| ActionRowBuilder<StringSelectMenuBuilder>
		>()

		embed.setDescription(
			ctx.extras.player.zone.data.gather?.length
				? 'Awaiting input...'
				: 'There are no spots for gathering :('
		)

		if (skill !== undefined) {
			components.push(
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setLabel('⚒️')
						.setCustomId(perform.id(skill))
						.setStyle(ButtonStyle.Success)
				)
			)
		}

		if (ctx.extras.player.zone.data.gather?.length) {
			components.push(
				new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId(choose.id())
						.setMinValues(1)
						.setMaxValues(1)
						.addOptions(
							ctx.extras.player.zone.data.gather.map((x) =>
								new StringSelectMenuOptionBuilder()
									.setLabel(SkillType[x.data.skill])
									.setValue(x.data.skill.toString())
									.setDefault(skill === x.data.skill)
							)
						)
				)
			)
		}

		return {
			embeds: [embed],
			components,
		}
	}

	public static async execute(
		ctx: AnyDiscordUpdatableContext,
		skill: SkillType
	) {
		const spot = ctx.extras.player.zone.data.gather!.find(
			(x) => x.data.skill === skill
		)!

		const display = GatherResponse.display(ctx, skill)

		const reqs = spot.data.requirements?.has(ctx.extras.player)

		if (Array.isArray(reqs)) {
			display.embeds[0]
				.setColor(Colors.Red)
				.setDescription(reqs.join('\n'))
				.setTitle('Missing Requirements')
			await ctx.input.update(display)
			return false
		}

		display.embeds[0].setDescription(
			spot.consume(ctx.extras.player).join('\n') || 'Nothing found... :('
		)

		await ctx.input.update(display)
		return true
	}
}
