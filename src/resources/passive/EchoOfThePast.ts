import { Hit } from "../../structures/battle/actions/Hit.js";
import { Info } from "../../structures/battle/actions/Info.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";
import Poison from "../effect/Poison.js";

const DamageReturnMultiplier = 0.1

export default new ItemPassive({
    id: 6,
    name: "Echo of the Past",
    types: [ Hit ],
    showTag: false,
    gearTypes: [ GearType.Chestplate ],
    info: payload => `Reflect damage back to the target for ${DamageReturnMultiplier * 100}%`,
    criteria: payload => payload.entity === payload.action.as<Hit>().defender,
    execute(payload) {
        const hit = payload.action as Hit

        const dmg = hit.damage * DamageReturnMultiplier

        if (!dmg)
            return false
        
        hit.add(
            Hit.from(payload.entity, hit.entity)
                .setFinalDamage(dmg)
                .setIgnoreSpecials()
                .setMessage("Some damage has been reflected back!"),
        )
        
        return true
    },
})