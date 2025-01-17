import { Hit } from "../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";

export const DamageMultiplier = 5

export default new ItemPassive({
    id: 8,
    name: "Premonition",
    types: [ Hit ],
    emoji: "<:premonition:1329093553925914666>",
    gearTypes: ItemPassive.OnlyWeapons,
    info: payload => `If target is at 100% HP, deal ${Util.formatFloat(DamageMultiplier * 100)}% more damage`,
    criteria: ItemPassive.attacking,
    execute(payload) {
        const hit = payload.action as Hit | SpellAttack
        
        hit.damage *= DamageMultiplier

        return true
    },
})