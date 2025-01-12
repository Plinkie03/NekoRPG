import { Player } from "./Player.js";
import { Node, NodeAction } from "../resource/node/Node.js";
import { Nullable } from "../resource/Item.js";
import { Game } from "../static/Game.js";
import NekoDatabase from "../../core/NekoDatabase.js";
import { RawPlayerTask } from "@prisma/client";

export interface PlayerTaskData {
    elapsed: number
    startedAt: number
    node: Node
}

export class PlayerTasks {
    public constructor(private readonly player: Player) { }

    public get raw() {
        return this.player.data.tasks
    }

    public get(type: NodeAction): Nullable<PlayerTaskData> {
        const task = this.raw.find(x => Game.Nodes.get(x.nodeId).type === type)

        if (!task) return null

        return {
            elapsed: Date.now() - task.startedAt.getTime(),
            node: Game.Nodes.get(task.nodeId),
            startedAt: task.startedAt.getTime()
        }
    }

    public async set(node: Node, state: boolean) {
        if (state) {
            const task = await NekoDatabase.rawPlayerTask.create({
                data: {
                    nodeId: node.id,
                    startedAt: new Date(),
                    playerId: this.player.id
                }
            })

            this.raw.push(task)
        } else {
            await NekoDatabase.rawPlayerTask.delete({
                where: {
                    playerId_nodeId: {
                        nodeId: node.id,
                        playerId: this.player.id
                    }
                }
            })

            this.raw.splice(this.raw.findIndex(x => x.nodeId === node.id), 1)
        }
    }

    /**
     * 
     * @param node 
     * @returns false if the node is not within the zone
     */
    public start(node: Node) {
        return !this.player.zone.nodes?.includes(node) ? Promise.resolve(false) : node.start(this.player)
    }

    /**
     * 
     * @param type 
     * @returns false if not busy
     */
    public finish(type: NodeAction) {
        const task = this.get(type)
        return task ? task.node.finish(this.player, task) : Promise.resolve(false as const)
    }
}