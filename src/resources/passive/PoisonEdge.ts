import { Hit } from "../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";
import Poison from "../effect/Poison.js";

const Duration = 5

export default new ItemPassive({
    id: 4,
    name: "Poison Edge",
    chance: 10,
    types: [ Hit ],
    gearTypes: ItemPassive.OnlyWeapons,
    cooldown: 5,
    info: payload => `${payload.data.chance}% chance to inflict poison to the target for ${Duration} turns`,
    criteria: ItemPassive.attacking,
    execute(payload) {
        const hit = payload.action as Hit
        
        hit.add(hit.defender.moddedStats.inflict(Poison, Duration))

        return true
    },
})