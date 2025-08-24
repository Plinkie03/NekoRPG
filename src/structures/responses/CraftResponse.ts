import {
	AnyDiscordUpdatableContext,
	BaseItem,
	CraftItemResponseType,
	Formatters,
	PlayerInventoryItem,
	Util,
} from '@nekorpg'
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Colors,
	ContainerBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
} from 'discord.js'
import view from '../../interactions/buttons/inventory/view.js'

export class CraftResponse {
	private constructor() {}

	public static async execute(
		ctx: AnyDiscordUpdatableContext,
		item: PlayerInventoryItem | BaseItem,
		times = (item instanceof PlayerInventoryItem
			? item.item
			: item
		).data.requirements?.craft?.getMaxAmount(ctx.extras.player) ?? 1
	) {
		const result = (
			item instanceof PlayerInventoryItem ? item.item : item
		).craft(ctx.extras.player, times)

		const container = new ContainerBuilder()
			.setAccentColor(
				result.type === CraftItemResponseType.Success
					? Colors.Green
					: Colors.Red
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`# ${Formatters.camelToTitle(
						CraftItemResponseType[result.type]
					)}`
				)
			)
			.addSeparatorComponents(
				new SeparatorBuilder()
					.setDivider(true)
					.setSpacing(SeparatorSpacingSize.Small)
			)

		const component = new TextDisplayBuilder()

		switch (result.type) {
			case CraftItemResponseType.Failed: {
				component.setContent(
					`You attempted to craft ${item} ${Formatters.multiplier(
						times
					)} but failed...`
				)
				break
			}

			case CraftItemResponseType.InventoryFull: {
				component.setContent(`Your inventory is full`)
				break
			}

			case CraftItemResponseType.MissingRequirements: {
				component.setContent(
					`You don't meet the requirements to craft this item:\n${result.errors.join(
						'\n'
					)}`
				)
				break
			}

			case CraftItemResponseType.NotCraftable: {
				component.setContent('This item is not craftable')
				break
			}

			case CraftItemResponseType.Success: {
				component.setContent(
					`Crafted ${result.item}\n**Success**: ${Formatters.int(
						result.success
					)}\n**Failed**: ${Formatters.int(result.failed)}`
				)
				break
			}
		}

		container.addTextDisplayComponents(component)

		await ctx.input.update({
			flags: MessageFlags.IsComponentsV2,
			components: [
				container,
				...Util.splitComponents(
					item instanceof PlayerInventoryItem
						? [
								new ButtonBuilder()
									.setLabel('Back')
									.setCustomId(view.id(item))
									.setStyle(ButtonStyle.Primary),
						  ]
						: []
				),
			],
		})

		return true
	}
}
