import { Prisma, PrismaClient, RawPlayerQuest, RawPlayerSkills, RawPlayerTasks } from "@prisma/client";
import { Collection, User } from "discord.js";
import { Player } from "../structures/player/Player.js"
import { Logger } from "../structures/static/Logger.js";
import cloneDeep from "clone-deep"

const PlayerIncludes = {
    items: {
        include: {
            stats: true
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
                id,
                skills: {
                    create: {}
                },
                tasks: {
                    create: {}
                }
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

    public updatePlayerTasks(data: Partial<RawPlayerTasks> & { playerId: string }) {
        return this.rawPlayerTasks.update({
            data,
            where: {
                playerId: data.playerId
            }
        })
    }

    public updateSkill(data: Partial<RawPlayerSkills> & { playerId: string }) {
        return this.rawPlayerSkills.update({
            data,
            where: {
                playerId: data.playerId
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

    public saveFullPlayer(data: PlayerData) {
        data = cloneDeep(data)
        
        // @ts-ignore
        delete data.tasks!.playerId
        
        // @ts-ignore
        delete data.skills!.playerId

        return this.rawPlayer.update({
            data: {
                ...data,
                skills: {
                    update: data.skills!
                },
                tasks: {
                    update: data.tasks!
                },
                quests: undefined,
                items: undefined
            },
            where: {
                id: data.id
            }
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
