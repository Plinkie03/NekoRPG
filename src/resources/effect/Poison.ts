import { Ailment } from "../../structures/battle/actions/Ailment.js";
import { Effect } from "../../structures/resource/Effect.js";

export default new Effect({
    id: 1,
    name: "Poison",
    description: "Drains the entity's health by 3% every round.",
    tick(payload) {
        payload.fight.lastLog.push(Ailment.run(payload.entity, payload.effect, payload.entity.moddedStats.maxHealth * 0.03))
    },
})