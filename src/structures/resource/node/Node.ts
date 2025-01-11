import { Player } from "../../player/Player.js"
import { PlayerInventoryItem } from "../../player/PlayerInventoryItem.js"
import { PlayerTaskData, PlayerTasks, Tasks } from "../../player/PlayerTasks.js"
import { Requirements } from "../../static/Requirements.js"
import { RewardData, Rewards } from "../../static/Rewards.js"
import { Time } from "../../static/Time.js"
import { Util } from "../../static/Util.js"
import { Item, Nullable } from "../Item.js"
import { Resource, ResourceData } from "../Resource.js"

export interface NodeItemData {
    item: Item

    /**
     * Time in milliseconds to collect resource
     */
    hardness: number

    /**
     * Chance per every collect to actually collect resource
     * @default 100
     */
    chance?: number

    /**
     * Amount collected for success collection
     * @default 1
     */
    amount?: number

    /**
     * Extra rewards upon collecting
     * @default undefined
     */
    rewards?: RewardData
}

export interface NodeData extends ResourceData {
    resources: NodeItemData[]
    requirements?: Requirements
}

export enum NodeStartCollectResponseType {
    Success,
    MissingRequirements,
    Busy
}

export type NodeStartCollectResponse = {
    type: NodeStartCollectResponseType.Success | NodeStartCollectResponseType.Busy
} | {
    type: NodeStartCollectResponseType.MissingRequirements,
    errors: string[]
}

export enum NodeFinishCollectResponseType {
    Success,
    Failed
}

export interface ResourceCollectionResultData extends ResourceStatsData {
    rewards: string[]
}

export type NodeFinishCollectResponse = PlayerTaskData & ({
    type: NodeFinishCollectResponseType.Failed
} | {
    type: NodeFinishCollectResponseType.Success,
    results: ResourceCollectionResultData[]
})

export interface ResourceStatsData {
    success: number
    failed: number
}

export type SkipFirstArrayArg<T> = T extends [ infer _, ...infer A ] ? A : []

export abstract class Node extends Resource<NodeData> {
    public abstract get type(): keyof Tasks

    public get resources() {
        return this.data.resources
    }

    public async start(player: Player): Promise<NodeStartCollectResponse> {
        if (player.tasks.get(this.type)) return { type: NodeStartCollectResponseType.Busy }

        await player.tasks.set(this.type, this.id)

        return { type: NodeStartCollectResponseType.Success }
    }

    public async finish(player: Player, task: PlayerTaskData): Promise<NodeFinishCollectResponse> {
        await player.tasks.set(this.type, null)

        const results = new Array<ResourceCollectionResultData>()

        for (const resource of task.node.resources) {
            const stats = Node.getResourceStats(resource, task.elapsed)
            
            if (stats.success === 0) continue

            results.push({
                ...stats,
                rewards: await Rewards.give({
                    player,
                    rewards: {
                        ...resource.rewards,
                        items: [ resource.item ]
                    },
                    times: stats.success
                })
            })
        }
        
        if (!results.length) return { type: NodeFinishCollectResponseType.Failed, ...task }

        return {
            type: NodeFinishCollectResponseType.Success,
            results,
            ...task
        }
    }

    public static getResourceStats(resource: NodeItemData, elapsed: number): ResourceStatsData {
        const amount = resource.amount ?? 1

        const total = Math.floor(Math.min(elapsed, Time.days(1)) / resource.hardness * amount)

        let success = 0

        if (resource.chance) {
            for (let i = 0;i < total;i++) {
                if (Util.isChance(resource.chance))
                    success++
            }
        } else success = total

        return {
            failed: total - success,
            success
        }
    }

    public hasRequirements(...params: SkipFirstArrayArg<Parameters<typeof Requirements.has>>) {
        return Requirements.has(this.data.requirements, ...params)
    }
}