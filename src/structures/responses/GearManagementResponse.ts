import {
	AnyDiscordUpdatableContext,
	EquipItemResponseType,
	Formatters,
	GearItem,
	GearType,
	PlayerInventoryItem,
	UnequipItemResponseType,
} from '@nekorpg'
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Colors,
	ContainerBuilder,
	EmbedBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
} from 'discord.js'
import view from '../../interactions/buttons/inventory/view.js'

export class GearManagementResponse {
	private constructor() {}

	public static async unequip(
		ctx: AnyDiscordUpdatableContext,
		invItem: PlayerInventoryItem<GearItem>
	) {
		const result = ctx.extras.player.gear.unequip(invItem.item.gearType)

		const container = new ContainerBuilder()
			.setAccentColor(
				result.type === UnequipItemResponseType.Success
					? Colors.Green
					: Colors.Red
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`# ${Formatters.camelToTitle(
						UnequipItemResponseType[result.type]
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
			case UnequipItemResponseType.NotEquipped: {
				component.setContent(`This item is not equipped`)
				break
			}

			case UnequipItemResponseType.NotFound: {
				component.setContent(`There is no item equipped in this slot`)
				break
			}

			case UnequipItemResponseType.Success: {
				component.setContent(`**Unequipped**: ${result.item}`)
				break
			}
		}

		container.addTextDisplayComponents(component)

		await ctx.input.update({
			flags: MessageFlags.IsComponentsV2,
			components: [
				container,
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setLabel('Back')
						.setCustomId(view.id(invItem))
						.setStyle(ButtonStyle.Primary)
				),
			],
		})

		return true
	}

	public static async equip(
		ctx: AnyDiscordUpdatableContext,
		invItem: PlayerInventoryItem<GearItem>
	) {
		const result = ctx.extras.player.gear.equip(invItem)

		const container = new ContainerBuilder()
			.setAccentColor(
				result.type === EquipItemResponseType.Success
					? Colors.Green
					: Colors.Red
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`# ${Formatters.camelToTitle(
						EquipItemResponseType[result.type]
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
			case EquipItemResponseType.NotEquippable: {
				component.setContent('This item cannot be equipped')
				break
			}

			case EquipItemResponseType.AlreadyEquipped: {
				component.setContent('This item is already equipped')
				break
			}

			case EquipItemResponseType.MissingRequirements: {
				component.setContent(
					`You're missing the following requirements to equip this item:\n${result.errors.join(
						'\n'
					)}`
				)
				break
			}

			case EquipItemResponseType.Success: {
				component.setContent(
					`**Equipped**: ${invItem}${
						result.old ? `\n**Unequipped**: ${result.old}` : ''
					}`
				)
				break
			}
		}

		container.addTextDisplayComponents(component)

		await ctx.input.update({
			flags: MessageFlags.IsComponentsV2,
			components: [
				container,
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setLabel('Back')
						.setCustomId(view.id(invItem))
						.setStyle(ButtonStyle.Primary)
				),
			],
		})

		return true
	}
}
