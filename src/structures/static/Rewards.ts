import { RawPlayer, RawPlayerSkills } from "@prisma/client";
import { Player } from "../player/Player.js";
import { PlayerSkills, Skills } from "../player/PlayerSkills.js";
import { Util } from "./Util.js";
import NekoDatabase from "../../core/NekoDatabase.js";
import { Item } from "../resource/Item.js";

export interface RewardData {
    items?: RewardItemData[]
    skills?: Partial<Skills>
    xp?: number
    money?: number
    gems?: number
}

export interface RewardItemData {
    item: Item
    chance?: number
    amount?: number
}

export class Rewards {
    private constructor() {}

    public static async give(rewards?: RewardData, player?: Player, times = 1): Promise<string[]> {
        const output = new Array<string>()

        if (!rewards || !times) return output

        const saves = new Array<keyof RawPlayer>()
        const skillSaves = new Array<keyof RawPlayerSkills>()

        if (rewards.xp) {
            const xp = rewards.xp * times
            const result = player?.addXp(xp)
            output.push(`${xp} XP`)
            if (result === true)
                output.push(`${player!.displayName} is now level ${player!.level}!`)

            if (player) 
                saves.push("xp", "level")
        }

        if (rewards.money) {
            const money = rewards.money * times
            output.push(`$${money}`)
            player?.addMoney(money)
            if (player)
                saves.push("money")
        }

        if (rewards.gems) {
            const gems = rewards.gems * times
            output.push(`💎${gems}`)
            player?.addGems(gems)
            if (player)
                saves.push("gems")
        }

        if (rewards.items?.length) {
            for (const rewardItem of rewards.items) {
                const amount = rewardItem.amount ?? 1
                const amountDisplay = amount && amount > 1 ? ` (${amount}x)` : ""

                if (player) {
                    if (!rewardItem.chance || Util.isChance(rewardItem.chance)) {
                        const result = await player.inventory.addItem({ itemId: rewardItem.item.id, amount })
                        output.push(result.detailedName + amountDisplay)
                    }
                } else {
                    output.push(`${rewardItem.item.simpleName}${amountDisplay}${rewardItem.chance ? ` (${rewardItem.chance}%)` : ""}`)
                }
            }
        }

        if (rewards.skills) {
            for (const skillName of Util.objectKeys(rewards.skills)) {
                const skillXp = rewards.skills[skillName]! * times
                const result = player?.skills.addXp(skillName, skillXp)
                output.push(`${skillXp} ${Util.camelToTitle(skillName)} XP`)
                
                if (result === true)
                    output.push(`${player!.displayName}'s ${Util.camelToTitle(skillName)} is now level ${player!.skills.getLevel(skillName)}!`)

                if (player)
                    skillSaves.push(PlayerSkills.formatSkillLevel(skillName), PlayerSkills.formatSkillXp(skillName))
            }
        }

        if (player && (saves.length || skillSaves.length)) {
            // TODO: AVOID EMPTY TRANSACTIONS
            await NekoDatabase.$transaction([
                player.save(saves),
                player.skills.save(skillSaves)
            ])
        }
        
        return output
    }
}