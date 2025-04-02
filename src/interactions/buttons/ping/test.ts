import { Interaction, InteractionType } from "../../../structures/discord/Interaction.js";

export default new Interaction({
    id: 1,
    type: InteractionType.Button,
    async execute(ctx) {
        await ctx.interaction.reply("hello!")
        return true    
    },
})