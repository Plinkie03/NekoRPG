import { Hit } from "../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";

const MaxMultiplier = 0.3

export default new ItemPassive({
    id: 1,
    name: "Berserk",
    types: [ Hit, SpellAttack ],
    info: payload => `For every percent of health lost, Damage Taken -1%, Strength +1% (Caps at ${Util.formatFloat(MaxMultiplier * 1e2)})`,
    criteria: payload => true,
    execute(payload) {
        const hit = payload.action as Hit | SpellAttack
        const hpLostMultiplier = Math.min(1 - payload.entity.hp / payload.entity.moddedStats.maxHealth, MaxMultiplier)

        if (hit.entity === payload.entity) {
            hit.damage *= (1 + hpLostMultiplier)
        }

        if (hit.defender === payload.entity) {
            hit.damage *= (1 - hpLostMultiplier)
        }

        return true
    },
})