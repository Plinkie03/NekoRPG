import { Ailment } from "../../structures/battle/actions/Ailment.js";
import { Effect } from "../../structures/resource/Effect.js";

export default new Effect({
    id: 1,
    name: "Poison",
    emoji: "<:poison:1324082467543453727>",
    description: "Drains the entity's health by 3% every round.",
    async tick(payload) {
        payload.fight.lastLog.push(await Ailment.run(payload.entity, payload.effect, payload.entity.moddedStats.maxHealth * 0.03))
    },
})