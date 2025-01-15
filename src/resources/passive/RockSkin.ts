import { Hit } from "../../structures/battle/actions/Hit.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";

export const Reduction = 0.3

export default new ItemPassive({
    id: 11,
    name: "Rock Skin",
    types: ItemPassive.AttackActions,
    gearTypes: [ GearType.Boots ],
    info: () => `While stunned, your damage taken is reduced by ${Reduction * 100}%`,
    criteria: payload => ItemPassive.defending(payload) && payload.entity.moddedStats.isStunned(),
    execute(payload) {
        (payload.action as Hit).damage *= (1 - Reduction)
        return true
    },
})