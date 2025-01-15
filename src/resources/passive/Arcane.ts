import { Hit } from "../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";

export const Reduction = 0.25

export default new ItemPassive({
    id: 13,
    name: "Arcane",
    types: [ SpellAttack ],
    gearTypes: [ GearType.Leggings ],
    info: () => `When hit by spells, your damage taken is reduced by ${Reduction * 100}%`,
    criteria: ItemPassive.defending,
    execute(payload) {
        (payload.action as SpellAttack).damage *= (1 - Reduction)
        return true
    },
})