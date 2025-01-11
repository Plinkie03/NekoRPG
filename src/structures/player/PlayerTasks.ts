import { RawPlayerTasks } from "@prisma/client";
import { Player } from "./Player.js";
import { Node } from "../resource/node/Node.js";
import { Nullable } from "../resource/Item.js";
import { Game } from "../static/Game.js";
import NekoDatabase from "../../core/NekoDatabase.js";

export interface PlayerTaskData {
    elapsed: number
    startedAt: number
    node: Node
}

export type Tasks = {
    [P in keyof RawPlayerTasks as P extends `${infer A}NodeId` ? A : never]: Nullable<PlayerTaskData>
}

export class PlayerTasks {
    public constructor(private readonly player: Player) { }

    public get current(): Tasks {
        return {
            mining: this.get("mining"),
            woodcutting: this.get("woodcutting")
        }
    }

    public get raw() {
        return this.player.data.tasks!
    }

    public get(type: keyof Tasks): Nullable<PlayerTaskData> {
        const nodeId = this.raw![PlayerTasks.formatNodeId(type)]
        const startedAt = this.raw![PlayerTasks.formatNodeStartedAt(type)]

        if (!nodeId) return null

        return {
            elapsed: Date.now() - startedAt!.getTime(),
            node: Game.Nodes.get(nodeId),
            startedAt: startedAt!.getTime()
        }
    }

    public static formatNodeId(type: keyof Tasks) {
        return `${type}NodeId` as const
    }

    public static formatNodeStartedAt(type: keyof Tasks) {
        return `${type}NodeStartedAt` as const
    }

    public set(type: keyof Tasks, id?: Nullable<number>) {
        const nodeStartedStr = PlayerTasks.formatNodeStartedAt(type)
        const nodeIdStr = PlayerTasks.formatNodeId(type)

        this.raw[nodeIdStr] = id ?? null
        this.raw[nodeStartedStr] = id ? new Date() : null

        return this.player.save()
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
    public finish(type: keyof Tasks) {
        const task = this.get(type)
        return task ? task.node.finish(this.player, task) : Promise.resolve(false as const)
    }
}