import { Hit } from "../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";

export default new ItemPassive({
    id: 3,
    name: "Execution",
    types: ItemPassive.AttackActions,
    gearTypes: ItemPassive.OnlyWeapons,
    chance: 20,
    info: payload => `${payload.data.chance}% chance to execute the target [Execution: deal 3x damage]`,
    criteria: payload => true,
    execute(payload) {
        const hit = payload.action as Hit | SpellAttack

        if (hit.entity === payload.entity) {
            hit.damage *= 3
            hit.append(`[EXECUTION]`)
        }

        return true
    },
})