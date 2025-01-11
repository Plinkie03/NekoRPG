import { Heal } from "../../../structures/battle/actions/Heal.js";
import { Hit } from "../../../structures/battle/actions/Hit.js";
import { Info } from "../../../structures/battle/actions/Info.js";
import { SpellAttack } from "../../../structures/battle/actions/SpellAttack.js";
import { EntitySpell } from "../../../structures/entity/EntitySpell.js";
import { Item, ItemType } from "../../../structures/resource/Item.js";
import { Util } from "../../../structures/static/Util.js";
import Poison from "../../effect/Poison.js";
import Slime from "../../monster/Slime.js";

const Minion = Slime
const MinionCount = 3

export default new Item<ItemType.Spell>({
    id: 10,
    type: ItemType.Spell,
    name: "Slime Army",
    cooldown: 10,
    chance: 25,
    info: spell => `Summons ${Minion.displayName} minions`,
    execute(payload) {
        for (let i = 0;i < MinionCount;i++) {
            payload.fight.addSummon(payload.entity, Minion)
            payload.cast.add(new Info(payload.entity, `Summoned ${Minion.displayName}`))
        }
    },
})