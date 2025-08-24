import { Cache, Player } from '@nekorpg'
import { PrismaClient } from '../../prisma/generated/index.js'
import { User } from 'discord.js'

export type Nullable<T> = T | null
export type PlayerData = Exclude<
	Awaited<ReturnType<typeof NekoDatabase.rawPlayer._get>>,
	null
>

const PlayerIncludes = {
	items: true,
	skills: true,
	quests: true,
}

export const NekoDatabase = new PrismaClient().$extends({
	client: {
		players: new Cache<string, Player>(3e5).on(
			'expire',
			async (_, player) => {
				await NekoDatabase.rawPlayer.save(player.data)
			}
		),
	},
	model: {
		rawPlayer: {
			async get(user: User) {
				const player = await NekoDatabase.rawPlayer.getByUserId(user.id)
				player.data.name = user.username
				return player
			},

			async getByUserId(userId: string) {
				const cache = NekoDatabase.players.get(userId)
				if (cache) {
					return cache
				}

				const player = new Player(
					(await NekoDatabase.rawPlayer._get(userId)) ??
						(await NekoDatabase.rawPlayer._create(userId))
				)
				NekoDatabase.players.set(player.id, player)

				return player
			},

			_create(userId: string) {
				return NekoDatabase.rawPlayer.create({
					data: { id: userId },
					include: PlayerIncludes,
				})
			},

			_get(userId: string) {
				return NekoDatabase.rawPlayer.findUnique({
					where: {
						id: userId,
					},
					include: PlayerIncludes,
				})
			},

			save(data: PlayerData) {
				return NekoDatabase.rawPlayer.update({
					data: {
						...data,
						items: {
							deleteMany: {},
							createMany: {
								data: data.items.map((x) => ({
									...x,
									playerId: undefined,
								})),
							},
						},
						quests: {
							deleteMany: {},
							createMany: {
								data: data.quests.map((x) => ({
									...x,
									playerId: undefined,
								})),
							},
						},
						skills: {
							deleteMany: {},
							createMany: {
								data: data.skills.map((x) => ({
									...x,
									playerId: undefined,
								})),
							},
						},
					},
					where: {
						id: data.id,
					},
				})
			},
		},
	},
})
