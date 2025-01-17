import { Heal } from "../../../structures/battle/actions/Heal.js";
import { Hit } from "../../../structures/battle/actions/Hit.js";
import { SpellAttack } from "../../../structures/battle/actions/SpellAttack.js";
import { EntitySpell } from "../../../structures/entity/EntitySpell.js";
import { Item, ItemType } from "../../../structures/resource/Item.js";
import { Util } from "../../../structures/static/Util.js";
import Poison from "../../effect/Poison.js";

function arrowCount(spell: EntitySpell) {
    return Math.floor(3 * spell.multiplier)
}

function arrowMultiplier(spell: EntitySpell) {
    return 0.5 * spell.multiplier
}

const stunTime = 2
const fortificationTime = 5
const fortificationMultiplier = 0.25

export default new Item<ItemType.Spell>({
    id: 2,
    type: ItemType.Spell,
    price: 500,
    emoji: "<:arrow_rain:1324892721621499914>",
    name: "Arrow Rain",
    cooldown: 5,
    info: spell => `Unleash a volley of ${arrowCount(spell)} magical arrows upon the target dealing ${spell.entity.baseStats.displayDamage(arrowMultiplier(spell))} damage each, reducing their defense by ${fortificationMultiplier}x for ${Util.plural("round", fortificationTime)} and stunning the target for ${Util.plural("round", stunTime)}.`,
    execute(payload) {
        for (let i = 0, len = arrowCount(payload.spell);i < len;i++) {
            payload.cast.add(
                SpellAttack.new(payload.entity, payload.target, arrowMultiplier(payload.spell))
            )
        }

        payload.cast.addMany(
            payload.target.moddedStats.stun(stunTime),
            payload.target.moddedStats.addFortification({
                duration: fortificationTime,
                multiplier: -fortificationMultiplier,
                name: "defense"
            })
        )
    },
})