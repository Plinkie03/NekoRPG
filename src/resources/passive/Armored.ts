import { Hit } from "../../structures/battle/actions/Hit.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";

export const Reduction = 0.25

export default new ItemPassive({
    id: 12,
    name: "Armored",
    types: [ Hit ],
    gearTypes: [ GearType.Leggings ],
    info: () => `When hit by basic attacks, your damage taken is reduced by ${Reduction * 100}%`,
    criteria: ItemPassive.defending,
    execute(payload) {
        (payload.action as Hit).damage *= (1 - Reduction)
        return true
    },
})