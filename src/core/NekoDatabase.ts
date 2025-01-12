import { Prisma, PrismaClient, RawPlayerQuest } from "@prisma/client";
import { Collection, User } from "discord.js";
import { Player } from "../structures/player/Player.js"
import { Logger } from "../structures/static/Logger.js";
import cloneDeep from "clone-deep"

const PlayerIncludes = {
    items: {
        include: {
            stats: true,
            passives: true
        }
    },
    tasks: true,
    skills: true,
    quests: true
} as const

export type PlayerData = Exclude<Awaited<ReturnType<NekoDB["getRawPlayer"]>>, null>
export type PlayerItemData = PlayerData["items"][number]

class NekoDB extends PrismaClient {
    private readonly players: Collection<string, Player> = new Collection()

    private getRawPlayer(id: string) {
        return this.rawPlayer.findUnique({
            where: {
                id
            },
            include: PlayerIncludes
        })
    }

    public async getPlayerById(id: string) {
        const existing = this.players.get(id)
        if (existing) return existing
        
        const fromDb = (await this.getRawPlayer(id)) ?? (await this.createPlayer(id))
        const player = new Player(fromDb)
        
        await player.skills.ensure()
        
        this.players.set(player.id, player)
        
        return player
    }

    public async getPlayerByUser(user: User) {
        const got = await this.getPlayerById(user.id)
        got.data.username = user.username
        return got
    }

    public createPlayer(id: string) {
        return this.rawPlayer.create({
            data: {
                id
            },
            include: PlayerIncludes
        })
    }

    public deleteItem(uuid: string) {
        return this.rawItem.delete({
            where: {
                uuid
            }
        })
    }
    
    public updateItem(data: Prisma.RawItemUncheckedUpdateInput) {
        return this.rawItem.update({
            data,
            where: {
                uuid: <string>data.uuid
            }
        })
    }

    public createItem(data: Prisma.RawItemUncheckedCreateInput) {
        return this.rawItem.create({
            data,
            include: {
                passives: true,
                stats: true
            }
        })
    }

    public updatePlayer(data: Prisma.RawPlayerUncheckedUpdateInput & { id: string }) {
        return this.rawPlayer.update({
            data,
            where: {
                id: data.id
            }
        })
    }

    public updateQuest(data: Partial<RawPlayerQuest> & { uuid: string }) {
        return this.rawPlayerQuest.update({
            data,
            where: {
                uuid: data.uuid
            }
        })
    }

    public createQuest(data: Prisma.RawPlayerQuestUncheckedCreateInput) {
        return this.rawPlayerQuest.create({
            data
        })
    }

    public saveFullPlayer(data: Omit<PlayerData, "tasks">) {
        data = cloneDeep(data)

        return this.rawPlayer.update({
            data: {
                ...data,
                skills: undefined,
                tasks: undefined,
                quests: undefined,
                items: undefined
            },
            where: {
                id: data.id
            }
        })
    }

    public async queryPlayers(query: string) {
        return this.rawPlayer.findMany({
            where: {
                username: {
                    contains: query
                }
            },
            select: {
                id: true,
                username: true
            },
            take: 10
        })
    }
}

const NekoDatabase = new NekoDB({
    log: [
        { level: 'warn', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'error', emit: 'event' },
        // { level: 'query', emit: 'event' }
    ],
})

NekoDatabase.$on("error" as never, Logger.error)
NekoDatabase.$on("warn" as never, Logger.warn)
NekoDatabase.$on("info" as never, Logger.info)
NekoDatabase.$on("query" as never, Logger.info)

export default NekoDatabase
