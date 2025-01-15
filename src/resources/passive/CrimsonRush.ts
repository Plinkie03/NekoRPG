import { Hit } from "../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";

const AgilityBuff = 0.5
const AgilityDuration = 10
const MinHp = 0.4

export default new ItemPassive({
    id: 15,
    name: "Crimson Rush",
    gearTypes: [ GearType.Boots ],
    cooldown: 20,
    info: payload => `When under ${MinHp * 100}% HP, your agility is boosted by ${AgilityBuff * 100}% for ${AgilityDuration} rounds`,
    criteria: payload => ItemPassive.attackerUnderHp(payload, MinHp),
    execute(payload) {
        payload.action.add(
            payload.entity.moddedStats.addFortification({
                duration: AgilityDuration,
                multiplier: AgilityBuff,
                name: "agility"
            })
        )

        return true
    },
})