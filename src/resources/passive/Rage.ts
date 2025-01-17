import { Hit } from "../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";

const MinHpPercent = 0.25
const StrengthBuff = 2

export default new ItemPassive({
    id: 2,
    emoji: "<:rage:1329093384517980191>",
    name: "Rage",
    types: ItemPassive.AttackActions,
    gearTypes: ItemPassive.OnlyWeapons,
    info: payload => `When HP falls below ${MinHpPercent * 1e2}%, Strength ${StrengthBuff}x`,
    criteria: payload => ItemPassive.attacking(payload) && ItemPassive.attackerUnderHp(payload, MinHpPercent),
    execute(payload) {
        const hit = payload.action as Hit

        hit.damage *= StrengthBuff

        return true
    },
})