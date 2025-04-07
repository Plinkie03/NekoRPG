import { Prisma, PrismaClient } from '@prisma/client';
import { Cache } from '../structures/util/Cache.js';
import { User } from 'discord.js';
import { Player } from '../structures/entity/player/Player.js';

const PlayerIncludes = {
    skills: true,
    items: true,
};

export type RawPlayerData = Exclude<Awaited<ReturnType<typeof NekoDatabase['rawPlayer']['_get']>>, null>

export const NekoDatabase = new PrismaClient().$extends({
    client: {
        cache: {
            players: new Cache<string, Player>(),
        },
    },
    model: {
        rawItem: {
            add(data: Prisma.RawItemUncheckedCreateInput) {
                return NekoDatabase.rawItem.create({ data });
            },
        },

        rawPlayer: {
            async _get(id: string) {
                const existing = await NekoDatabase.rawPlayer.findUnique({
                    where: {
                        id,
                    },
                    include: PlayerIncludes,
                });

                return existing;
            },

            async _create(id: string) {
                return NekoDatabase.rawPlayer.create({
                    data: {
                        id,
                    },
                    include: PlayerIncludes,
                });
            },

            async _getById(id: string) {
                const data = await NekoDatabase.rawPlayer._get(id) ?? await NekoDatabase.rawPlayer._create(id);
                const player = new Player(data);
                NekoDatabase.cache.players.set(player.id, player);
                return player;
            },

            async get(user: User) {
                const existing = NekoDatabase.cache.players.get(user.id);
                if (existing) {
                    return existing;
                }

                const player = await NekoDatabase.rawPlayer._getById(user.id);
                player.data.username = user.username;
                return player;
            },
        },
    },
});