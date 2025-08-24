import {
	Action,
	AnyDiscordUpdatableContext,
	Battle,
	BattleOption,
	BattleOptionType,
	Formatters,
	IExtrasData,
	Monster,
	Player,
	Round,
} from '@nekorpg'
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Colors,
	ContainerBuilder,
	MessageComponentInteraction,
	MessageFlags,
	SectionBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from 'discord.js'
import chooseAction from '../../discord/interactions/buttons/hunt/choose.js'
import chooseSpell from '../../discord/interactions/menus/hunt/choose.js'

export class BattleResponse {
	private constructor() {}

	public static async execute(
		ctx: AnyDiscordUpdatableContext,
		option: BattleOption
	) {
		if (!ctx.extras.player.battle) {
			return false
		}

		if (ctx.extras.player.battle.isAITurn()) {
			ctx.extras.player.battle.advance()
		} else {
			ctx.extras.player.battle.advance(option)
		}

		await ctx.input.update({
			flags: MessageFlags.IsComponentsV2,
			components: [BattleResponse.create(ctx.extras.player.battle)],
		})

		return true
	}

	public static create(battle: Battle): ContainerBuilder {
		const round = battle.getLastRound()
		const entity = battle.getCurrentEntity()
		const isPlayerTurn = entity instanceof Player
		const isActive = battle.isActive()
		const isActionButtonsAllowed =
			entity.stats.modded.isStunned() || !isActive || !isPlayerTurn

		const container = new ContainerBuilder()
			.setAccentColor(Colors.Aqua)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`# ${battle.entities
						.map((x) => x.name)
						.join(' VS ')} - ROUND ${battle.rounds.length + 1}${
						isPlayerTurn ? ' [YOUR TURN]' : ' [ENEMY TURN]'
					}`
				)
			)
			.addSeparatorComponents(
				new SeparatorBuilder()
					.setDivider(true)
					.setSpacing(SeparatorSpacingSize.Small)
			)
			.addSectionComponents(
				new SectionBuilder()
					.setThumbnailAccessory(
						new ThumbnailBuilder().setURL(battle.getMonster().url!)
					)
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							round
								? `${round.toString()}\n\n${
										isActive
											? `Awaiting ${entity}'s input...`
											: `${battle.getLoser()} died...`
								  }`
								: 'Awaiting input...'
						)
					)
			)
			.addSeparatorComponents(
				new SeparatorBuilder()
					.setDivider(true)
					.setSpacing(SeparatorSpacingSize.Small)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					battle.entities
						.map(
							(x) =>
								`${x}'s HP: ${Formatters.int(
									x.health
								)} / ${Formatters.int(
									x.stats.modded.maxHealth
								)}${
									x.stats.modded.ailments.size
										? ` (${x.stats.modded.ailments
												.map((x) => x.effect.emoji)
												.filter(Boolean)
												.join(' ')})`
										: ''
								}${
									x.stats.modded.modifiers.size
										? `\n(${x.stats.modded
												.getStatModifiers()
												.display()})`
										: ''
								}`
						)
						.join('\n')
				)
			)
			.addSeparatorComponents(
				new SeparatorBuilder()
					.setDivider(true)
					.setSpacing(SeparatorSpacingSize.Small)
			)
			.addActionRowComponents(
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setLabel('Attack')
						.setStyle(ButtonStyle.Danger)
						.setCustomId(chooseAction.id(BattleOptionType.Attack))
						.setDisabled(isActionButtonsAllowed),
					new ButtonBuilder()
						.setLabel('Defend')
						.setStyle(ButtonStyle.Secondary)
						.setCustomId(chooseAction.id(BattleOptionType.Defend))
						.setDisabled(isActionButtonsAllowed),
					new ButtonBuilder()
						.setLabel('Continue')
						.setStyle(ButtonStyle.Primary)
						.setCustomId(chooseAction.id(BattleOptionType.Skip))
						.setDisabled(!isActive),
					new ButtonBuilder()
						.setLabel('Focus')
						.setStyle(ButtonStyle.Secondary)
						.setCustomId(chooseAction.id(BattleOptionType.Focus))
						.setDisabled(isActionButtonsAllowed),
					new ButtonBuilder()
						.setLabel('Charge')
						.setStyle(ButtonStyle.Danger)
						.setCustomId(chooseAction.id(BattleOptionType.Charge))
						.setDisabled(isActionButtonsAllowed)
				)
			)

		const spells = battle
			.getCurrentEntity()
			.getSpells()
			.filter((x) => x.castable)

		if (!entity.stats.modded.isStunned() && isPlayerTurn && spells.length) {
			container.addActionRowComponents(
				new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId(chooseSpell.id())
						.setDisabled(!isActive)
						.addOptions(
							spells.map((x, i) =>
								new StringSelectMenuOptionBuilder()
									.setLabel(x.item.name)
									.setDescription(x.item.description!)
									.setValue(i.toString())
							)
						)
				)
			)
		}

		if (!isActive) {
			const winner = battle.getWinner()
			const isPlayerWinner = winner instanceof Player
			container.setAccentColor(isPlayerWinner ? Colors.Green : Colors.Red)
			;(container.components[0] as TextDisplayBuilder).setContent(
				`# FIGHT ENDED - ${winner} WON`
			)

			if (isPlayerWinner) {
				const mob = battle.getLoser() as Monster

				container
					.addSeparatorComponents(
						new SeparatorBuilder()
							.setDivider(true)
							.setSpacing(SeparatorSpacingSize.Small)
					)
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							mob.data.rewards
								.consume(winner as Player)
								.join('\n')
						)
					)
			}
		}

		return container
	}
}
