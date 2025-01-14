import { Hit } from "../../structures/battle/actions/Hit.js";
import { Info } from "../../structures/battle/actions/Info.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";
import Poison from "../effect/Poison.js";

export const DefenseIncreaseMultiplier = 1
export const HpReqPercent = 0.5
export const Duration = 10

export default new ItemPassive({
    id: 7,
    name: "Second Wind",
    cooldown: 30,
    types: ItemPassive.AttackActions,
    gearTypes: [GearType.Leggings],
    info: payload => `When your HP falls below ${Util.formatFloat(HpReqPercent * 100)}%, Defense stat is boosted by ${Util.formatFloat(DefenseIncreaseMultiplier * 100)}%`,
    criteria: payload => ItemPassive.defending(payload) && ItemPassive.defenderUnderHp(payload, HpReqPercent),
    execute(payload) {
        payload.action.add(
            payload.entity.moddedStats.addFortification({ duration: Duration, multiplier: DefenseIncreaseMultiplier, name: "defense" })
        )

        return true
    },
})