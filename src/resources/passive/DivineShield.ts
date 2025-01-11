import { Hit } from "../../structures/battle/actions/Hit.js";
import { Info } from "../../structures/battle/actions/Info.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";
import Poison from "../effect/Poison.js";

export const Duration = 5
export const DefenseReduction = 0.25

export default new ItemPassive({
    id: 3,
    name: "Divine Shield",
    cooldown: 10,
    types: ItemPassive.AttackActions,
    gearTypes: [ GearType.Chestplate ],
    info: payload => `When hit by an enemy, absorb the damage and stun the target for ${Duration} rounds, lowering their defense by ${DefenseReduction}x`,
    criteria: payload => payload.entity === payload.action.as<Hit>().defender,
    execute(payload) {
        const hit = payload.action as Hit

        hit.damage = 0

        hit.addMany(
            new Info(payload.entity, `Damage has been absorbed by ${payload.passive.simpleName}!`),
            hit.entity.moddedStats.stun(Duration),
            hit.entity.moddedStats.addFortification({ duration: Duration, multiplier: -DefenseReduction, name: "defense" })
        )

        return true
    },
})