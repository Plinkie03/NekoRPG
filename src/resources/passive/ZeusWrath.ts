import { Hit } from "../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../structures/battle/actions/SpellAttack.js";
import { GearType } from "../../structures/resource/Item.js";
import { ItemPassive } from "../../structures/resource/ItemPassive.js";
import { Util } from "../../structures/static/Util.js";

export const DamageMultiplier = 0.5
export const Quantity = 10

export default new ItemPassive({
    id: 9,
    name: "Zeus Wrath",
    types: ItemPassive.AttackActions,
    gearTypes: ItemPassive.OnlyWeapons,
    cooldown: 20,
    chance: 15,
    info: payload => `${payload.data.chance}% chance to unleash a storm of thunderbolts (${Quantity}) dealing ${Util.formatFloat(DamageMultiplier * 100)}% of your damage each`,
    criteria: ItemPassive.attacking,
    execute(payload) {
        const hit = payload.action as Hit

        const enemies = payload.fight.getAliveEntities(payload.fight.getEnemyTeam(payload.entity))

        if (!enemies.length) 
            return false

        for (let i = 0;i < Quantity;i++) {
            const enemy = enemies[Math.floor(Math.random() * enemies.length)]
            hit.add(
                Hit.from(payload.entity, enemy)
                    .setMessage(`${enemy.displayName} has been struck by a thunderbolt!`)
                    .setIgnoreSpecials()
                    .setMultiplier(DamageMultiplier)
            )
        }

        return true
    },
})