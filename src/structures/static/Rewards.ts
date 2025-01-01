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

export interface RewardOptions {
    rewards?: RewardData
    player?: Player
    times?: number
    hideIrrelevant?: boolean
    doNotSave?: boolean
}

export class Rewards {
    private constructor() {}

    public static async give({ hideIrrelevant = false, player, rewards, doNotSave = false, times = 1 }: RewardOptions): Promise<string[]> {
        const output = new Array<string>()

        if (!rewards || !times) return output

        let save = false

        function push(msg: string, relevant: boolean) {
            if (hideIrrelevant && !relevant)
                return
            output.push(msg)
        }

        if (rewards.xp) {
            const xp = rewards.xp * times
            const result = player?.addXp(xp)
            
            push(`${xp} XP`, false)

            if (result === true)
                push(`${player!.displayName} is now level ${player!.level}!`, true)

            if (player) 
                save = true
        }

        if (rewards.money) {
            const money = rewards.money * times
            player?.addMoney(money)

            push(`$${money}`, false)

            if (player)
                save = true
        }

        if (rewards.gems) {
            const gems = rewards.gems * times
            player?.addGems(gems)

            push(`💎${gems}`, false)

            if (player)
                save = true
        }

        if (rewards.items?.length) {
            for (const rewardItem of rewards.items) {
                const amount = rewardItem.amount ?? 1
                const amountDisplay = amount && amount > 1 ? ` (${amount}x)` : ""

                if (player) {
                    if (!rewardItem.chance || Util.isChance(rewardItem.chance)) {
                        const result = await player.inventory.addItem({ itemId: rewardItem.item.id, amount })
                        push(result.detailedName + amountDisplay, false)
                    }
                } else {
                    push(`${rewardItem.item.simpleName}${amountDisplay}${rewardItem.chance ? ` (${rewardItem.chance}%)` : ""}`, false)
                }
            }
        }

        if (rewards.skills) {
            for (const skillName of Util.objectKeys(rewards.skills)) {
                const skillXp = Math.floor(rewards.skills[skillName]! * times)
                const result = player?.skills.addXp(skillName, skillXp)

                push(`${skillXp} ${Util.camelToTitle(skillName)} XP`, false)
                
                if (result === true)
                    push(`${player!.displayName}'s ${Util.camelToTitle(skillName)} is now level ${player!.skills.getLevel(skillName)}!`, true)

                if (player)
                    save = true
            }
        }

        if (save && !doNotSave) {
            await player!.save()
        }
        
        return output
    }
}