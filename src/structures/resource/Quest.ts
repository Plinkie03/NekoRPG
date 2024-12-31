import { Player } from "../player/Player.js";
import { PlayerQuestData } from "../player/PlayerQuests.js";
import { Requirements } from "../static/Requirements.js";
import { RewardData, Rewards } from "../static/Rewards.js";
import { RequirementData } from "./Item.js";
import { SkipFirstArrayArg } from "./node/Node.js";
import { Resource, ResourceData } from "./Resource.js";

export interface QuestData extends ResourceData {
    requirements: {
        unlock?: RequirementData
        finish: RequirementData
    }
    rewards: RewardData
    once?: boolean
}

export enum QuestFinishResponseType {
    Success,
    MissingFinishRequirements,
    NotStarted
}

export type QuestFinishResponse = {
    type: QuestFinishResponseType.Success,
    rewards: string[]
} | {
    type: QuestFinishResponseType.NotStarted
} | {
    type: QuestFinishResponseType.MissingFinishRequirements,
    errors: string[]
}

export enum QuestStartResponseType {
    Success,
    Once,
    MissingUnlockRequirements,
    Started
}

export type QuestStartResponse = {
    type: QuestStartResponseType.Started | QuestStartResponseType.Success | QuestStartResponseType.Once
} | {
    type: QuestStartResponseType.MissingUnlockRequirements
    errors: string[]
}

export class Quest extends Resource<QuestData> {
    public hasUnlockRequirements(player?: Player) {
        return Requirements.has(this.data.requirements.unlock, player)
    }

    public hasFinishRequirements(player?: Player) {
        return Requirements.has(this.data.requirements.finish, player)
    }

    public async start(player: Player): Promise<QuestStartResponse> {
        const existing = player.quests.get(this.id)
        if (existing?.started) return { type: QuestStartResponseType.Started }
        else if (this.data.once && existing && existing.amount >= 1) return { type: QuestStartResponseType.Once }
        
        const errors = this.hasUnlockRequirements(player)
        if (errors !== true) return { type: QuestStartResponseType.MissingUnlockRequirements, errors }

        await player.quests.update(this.id, true)
        
        return { type: QuestStartResponseType.Success }
    }

    public async finish(player: Player): Promise<QuestFinishResponse> {
        const existing = player.quests.get(this.id)
        if (!existing?.started) return { type: QuestFinishResponseType.NotStarted }

        const errors = this.hasFinishRequirements(player)
        if (errors !== true) return { type: QuestFinishResponseType.MissingFinishRequirements, errors }

        await Requirements.consume(player, this.data.requirements.finish.items)

        await player.quests.update(this.id, false, existing.amount + 1)

        return {
            type: QuestFinishResponseType.Success,
            rewards: await player.give(this.data.rewards)
        }
    }
}