import { Heal } from "../../structures/battle/actions/Heal.js";
import { Hit } from "../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";

export const HealAmount = 0.1
export const HealRateBuff = 0.25
export const HealRateDuration = 6

export default new ItemPassive({
    id: 14,
    name: "God's Blessing",
    cooldown: 10,
    emoji: "<:godblessing:1329094597691052144>",
    gearTypes: ItemPassive.Jewelry,
    info: passive => `Heals ${HealAmount * 100}% of your Max HP and improves Healing Effect by ${HealRateBuff * 100}% for ${HealRateDuration} rounds`,
    criteria: () => true,
    execute(payload) {
        payload.action.addMany(
            new Heal(payload.entity, payload.entity.moddedStats.maxHealth * HealAmount),
            payload.entity.moddedStats.addFortification({
                duration: HealRateDuration,
                multiplier: HealRateBuff,
                name: "healRate"
            })
        )

        return true
    },
})
