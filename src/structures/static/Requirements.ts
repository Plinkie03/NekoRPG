import { Stats } from "../entity/EntityBaseStats.js";
import { Player } from "../player/Player.js";
import { Skills } from "../player/PlayerSkills.js";
import { Item, RequirementData, RequirementItemData } from "../resource/Item.js";
import { Util } from "./Util.js";

export class Requirements {
    private constructor() {}

    public static has(requirements?: RequirementData, player?: Player, times = 1): true | string[] {
        if (!requirements) return true

        const errors = new Array<string>()

        if (requirements.level && (!player || player.data.level < requirements.level)) {
            errors.push(`Player Level (${requirements.level})`)
        }

        if (requirements.items?.length) {
            for (const reqItem of requirements.items) {
                const quantity = player?.inventory.count(reqItem.item) ?? 0
                const required = reqItem.amount * times
                if (quantity < required)
                    errors.push(`${reqItem.item.simpleName}${required === 1 ? "" : ` (${required}x)`}`)
            }
        }

        if (requirements.stats) {
            for (const stat of Util.objectKeys(requirements.stats)) {
                const required = requirements.stats[stat]!
                const current = player?.baseStats[stat] ?? 0

                if (current < required) 
                    errors.push(`${Util.camelToTitle(stat)} Stat (${required})`)
            }
        }

        if (requirements.skills) {
            for (const skill of Util.objectKeys(requirements.skills)) {
                const required = requirements.skills[skill]!
                const current = player?.skills.getLevel(skill) ?? 0

                if (current < required)
                    errors.push(`${Util.camelToTitle(skill)} Skill (${required})`)
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