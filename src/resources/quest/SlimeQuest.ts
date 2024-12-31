import { Quest } from "../../structures/resource/Quest.js";
import SlimeBall from "../item/material/other/SlimeBall.js";

export default new Quest({
    id: 1,
    name: "Slime Quest",
    description: "Slimes cause too much trouble nowadays",
    requirements: {
        finish: {
            items: [
                {
                    amount: 10,
                    item: SlimeBall
                }
            ]
        }
    },
    rewards: {
        xp: 500,
        money: 250,
        gems: 100
    }
})