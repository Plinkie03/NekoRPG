import { config } from "dotenv";
import { NekoClient } from "./core/NekoClient.js";
import { env } from "process";
import { Options, Partials } from "discord.js";

config()

const client = new NekoClient({
    intents: [
        "GuildMessages",
        "Guilds",
        "GuildMembers"
    ],
    makeCache: Options.cacheWithLimits({
        MessageManager: 0,
        UserManager: 0,
        GuildMemberManager: 0
    }),
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ]
})

client.login(env.TOKEN)