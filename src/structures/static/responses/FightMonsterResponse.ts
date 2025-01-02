import { ButtonInteraction, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import retry from "../../../interactions/button/fight/retry.js"
import { Fight } from "../../battle/Fight.js"
import { Monster } from "../../monster/Monster.js"
import { Player } from "../../player/Player.js"
import { FightEmbed } from "../embeds/FightEmbed.js"

export class FightMonsterResponse {
    private constructor() {}

    public static async from(input: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, player: Player, mob: Monster) {
            mob = mob.clone()
    
            const fight = new Fight([
                [ player ],
                [ mob ]
            ])
    
            function advance(finish = false) {
                const row = new ActionRowBuilder<ButtonBuilder>()
                
                if (finish) {
                    row.addComponents(
                        new ButtonBuilder({
                            emoji: "🔄",
                            custom_id: retry.id(input.user, mob),
                            label: "Retry",
                            style: ButtonStyle.Primary
                        })
                    )
                }
    
                return input[(!input.replied ? (input.isButton() ? "update" : "reply") : "editReply") as "reply"]({
                    ephemeral: true,
                    embeds: [
                        FightEmbed.from(input, input.user, fight, mob)
                    ],
                    components: finish ? [ row ] : []
                })
            }
    
            fight.on("round", advance.bind(null, false))
    
            await fight.start()
    
            await advance(true)
    
            return true
        }
}