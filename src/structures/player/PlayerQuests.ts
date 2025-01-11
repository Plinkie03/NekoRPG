import NekoDatabase from "../../core/NekoDatabase.js";
import { Nullable } from "../resource/Item.js";
import { Quest } from "../resource/Quest.js";
import { Game } from "../static/Game.js";
import { Player } from "./Player.js";

export interface PlayerQuestData {
    uuid: string
    quest: Quest
    started: boolean
    amount: number
}

export class PlayerQuests {
    public constructor(private readonly player: Player) {}

    public get raw() {
        return this.player.data.quests
    }

    private getRaw(questId: number) {
        return this.raw.find(x => x.questId === questId) ?? null
    }

    public get(questId: number): Nullable<PlayerQuestData> {
        const raw = this.getRaw(questId)
        if (!raw) return raw

        return {
            started: raw.started,
            amount: raw.count,
            quest: Game.Quests.get(raw.questId),
            uuid: raw.uuid
        }
    }

    public async update(questId: number, started?: boolean, amount?: number) {
        const exists = this.getRaw(questId)
        if (!exists) {
            const raw = await NekoDatabase.createQuest({
                playerId: this.player.id,
                questId: questId,
                started,
                count: amount
            })

            this.raw.push(raw)
        } else {
            if (amount !== undefined)
                exists.count = amount

            if (started !== undefined)
                exists.started = started

            await NekoDatabase.updateQuest({
                uuid: exists.uuid,
                count: amount,
                started,
            })
        }
    }

    public start(quest: Quest) {
        return quest.start(this.player)
    }

    public finish(quest: Quest) {
        return quest.finish(this.player)
    }
}