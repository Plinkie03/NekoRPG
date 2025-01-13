import { Command } from "../structures/discord/Command.js"

export default new Command({
    name: "money",
    description: "Give you money",
    async execute(payload) {
        payload.extras.player.addMoney(1e9)
        await payload.extras.player.save()

        await payload.instance.reply("I gave you some money uwu")
        return true
    },
})