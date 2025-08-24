import {
	AnyDiscordContext,
	BaseItem,
	Formatters,
	GearItem,
	IExtrasData,
	PlayerInventoryItem,
	PrimaryColor,
	RarityType,
	Util,
} from '@nekorpg'
import {
	ActionRowBuilder,
	bold,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	ContainerBuilder,
	EmbedBuilder,
	MessageComponentInteraction,
	SectionBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
	ThumbnailBuilder,
	underline,
} from 'discord.js'
import management from '../../interactions/buttons/inventory/management.js'
import { randomUUID } from 'crypto'
import view from '../../interactions/buttons/inventory/view.js'
import equip from '../../interactions/buttons/inventory/item/equip.js'
import unequip from '../../interactions/buttons/inventory/item/unequip.js'
import craft from '../../interactions/buttons/inventory/item/craft.js'

export class InventoryManagementResponse {
	private constructor() {}

	public static item(
		ctx: AnyDiscordContext,
		input: BaseItem | PlayerInventoryItem
	) {
		const invItem = input instanceof BaseItem ? null : input
		const item = input instanceof BaseItem ? input : input.item

		const container = new ContainerBuilder().setAccentColor(PrimaryColor)

		const section = new SectionBuilder().addTextDisplayComponents(
			[
				`# ${item.name}`,
				item.description
					? `## ${item.description}`
					: `No description provided.`,
				invItem?.stats
					? `### ${invItem.stats.display()}`
					: item instanceof GearItem
					? item.stats.display()
					: null,
			]
				.filter(Boolean)
				.map((x) => new TextDisplayBuilder().setContent(x!))
		)

		if (item.emoji) {
			section.setThumbnailAccessory(
				new ThumbnailBuilder().setURL(item.url!)
			)
		}

		container.addSectionComponents(section)

		const buttons = new Array<ButtonBuilder>(
			new ButtonBuilder()
				.setLabel('Lock')
				.setCustomId(randomUUID())
				.setDisabled(true)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setLabel('Delete')
				.setCustomId(randomUUID())
				.setDisabled(true)
				.setStyle(ButtonStyle.Danger)
		)

		if (invItem) {
			if (item.equippable) {
				buttons.unshift(
					new ButtonBuilder()
						.setLabel(invItem.equipped ? 'Unequip' : 'Equip')
						.setCustomId(
							invItem.equipped
								? unequip.id(
										invItem as PlayerInventoryItem<GearItem>
								  )
								: equip.id(invItem)
						)
						.setDisabled(
							Array.isArray(
								(
									invItem as PlayerInventoryItem<GearItem>
								).item.data.requirements?.equip?.has(
									ctx.extras.player
								)
							)
						)
						.setStyle(ButtonStyle.Primary)
				)
			}

			buttons.push(
				new ButtonBuilder()
					.setLabel('Craft')
					.setDisabled(
						!item.data.requirements?.craft ||
							!item.data.requirements.craft.data.requirements.has(
								ctx.extras.player
							)
					)
					.setCustomId(craft.id(invItem))
					.setStyle(ButtonStyle.Primary)
			)
		}

		buttons.push(
			new ButtonBuilder()
				.setLabel('Back')
				.setCustomId(management.id(1))
				.setStyle(ButtonStyle.Primary)
		)

		return {
			components: [container, ...Util.splitComponents(buttons)],
		}
	}

	public static page(ctx: AnyDiscordContext, page = 1) {
		const [start, end] = Util.getPageIndexes(page)
		const items = ctx.extras.player.inventory.items.slice(start, end)
		const hasNextPage =
			ctx.extras.player.inventory.items.slice(end).length !== 0

		const container = new ContainerBuilder()
			.setAccentColor(PrimaryColor)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent('# INVENTORY')
			)

		for (const item of items) {
			container.addSeparatorComponents(
				new SeparatorBuilder()
					.setDivider(true)
					.setSpacing(SeparatorSpacingSize.Small)
			)

			const section = new SectionBuilder().setThumbnailAccessory(
				new ThumbnailBuilder().setURL(item.item.url!)
			)

			for (const info of [
				`# ${item.name} ${Formatters.multiplier(item.amount)}`,
				`## ${item.item.description ?? 'No description provided.'}`,
				item.stats ? `### ${item.stats.display()}` : null,
			].filter(Boolean)) {
				section.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(info!)
				)
			}

			container
				.addSectionComponents(section)
				.addActionRowComponents(
					new ActionRowBuilder<ButtonBuilder>().addComponents(
						new ButtonBuilder()
							.setLabel('View')
							.setStyle(ButtonStyle.Primary)
							.setCustomId(view.id(item))
					)
				)
		}

		return {
			components: [
				container,
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setLabel('◀️')
						.setDisabled(page === 1)
						.setStyle(ButtonStyle.Primary)
						.setCustomId(management.id(page - 1)),
					new ButtonBuilder()
						.setLabel('🔄')
						.setDisabled(false)
						.setStyle(ButtonStyle.Primary)
						.setCustomId(management.id(page)),
					new ButtonBuilder()
						.setLabel('▶️')
						.setDisabled(!hasNextPage)
						.setStyle(ButtonStyle.Primary)
						.setCustomId(management.id(page + 1))
				),
			],
		}
	}
}
