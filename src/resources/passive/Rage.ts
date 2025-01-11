import { Hit } from "../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";

const MinHpPercent = 0.25
const StrengthBuff = 2

export default new ItemPassive({
    id: 2,
    name: "Rage",
    info: payload => `When HP falls below ${MinHpPercent * 1e2}%, Strength ${StrengthBuff}x`,
    types: [ Hit, SpellAttack ],
    criteria: payload => payload.entity.hp / payload.entity.moddedStats.maxHealth <= MinHpPercent,
    execute(payload) {
        const hit = payload.action as Hit | SpellAttack

        console.log(`RAGE`)
        hit.damage *= StrengthBuff

        return true
    },
})