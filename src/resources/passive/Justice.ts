import { Hit } from "../../structures/battle/actions/Hit.js";
import { Info } from "../../structures/battle/actions/Info.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";

export const HpRecover = 0.5

export default new ItemPassive({
    id: 10,
    name: "Justice",
    types: ItemPassive.AttackActions,
    cooldown: 50,
    emoji: "<:justice:1329094084236935168>",
    gearTypes: [ GearType.Chestplate ],
    info: () => `A hit that causes death resurrects the player for ${HpRecover * 100}% of the HP`,
    criteria: payload => ItemPassive.defending(payload) && (payload.action as Hit).fatality,
    execute(payload) {
        (payload.action as Hit).damage = 0
        
        payload.entity.hp = Math.floor(payload.entity.moddedStats.maxHealth * HpRecover)
        
        payload.action.add(
            Info.new(payload.entity, `${payload.entity.displayName} has been brought back to life!`)
        )
        
        return true
    },
})