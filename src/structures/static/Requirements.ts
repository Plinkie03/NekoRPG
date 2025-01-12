import { Stats } from "../entity/EntityBaseStats.js";
import { Player } from "../player/Player.js";
import { Skills, SkillType } from "../player/PlayerSkills.js";
import { Item, RequirementData, RequirementItemData } from "../resource/Item.js";
import { Util } from "./Util.js";

export class Requirements {
    private constructor() {}

    public static has(requirements?: RequirementData, player?: Player, times = 1): true | string[] {
        if (!requirements) return true

        const errors = new Array<string>()

        if (requirements.level && (!player || player.data.level < requirements.level)) {
            errors.push(`Player Level (${Util.formatInt(requirements.level)})`)
        }

        if (requirements.items?.length) {
            for (const reqItem of requirements.items) {
                const quantity = player?.inventory.count(reqItem.item) ?? 0
                const required = reqItem.amount * times
                if (quantity < required)
                    errors.push(`${reqItem.item.simpleName}${required === 1 ? "" : ` (${Util.formatInt(required)}x)`}`)
            }
        }

        if (requirements.stats) {
            for (const stat of Util.objectKeys(requirements.stats)) {
                const required = requirements.stats[stat]!
                const current = player?.baseStats[stat] ?? 0

                if (current < required) 
                    errors.push(`${Util.camelToTitle(stat)} Stat (${Util.formatInt(required)})`)
            }
        }

        if (requirements.skills?.length) {
            for (const { level, type: skill } of requirements.skills) {
                const required = level
                const current = player?.skills.get(skill).level ?? 0

                if (current < required)
                    errors.push(`${Util.camelToTitle(SkillType[skill])} (${Util.formatInt(required)})`)
            }
        }

        return errors.length === 0 ? true : errors
    }

    public static async consume(player: Player, items?: RequirementItemData[], times = 1) {
        if (!items?.length) return

        for (const reqItem of items) {
            const invItem = player.inventory.getItemById(reqItem.item.id)!
            await invItem.setAmount(invItem.amount - (reqItem.amount * times))
        }
    }
}