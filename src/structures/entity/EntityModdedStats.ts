import { Fight } from "../battle/Fight.js";
import { Info } from "../battle/actions/Info.js";
import { Effect, EffectData } from "../resource/Effect.js";
import { ItemPassive, ItemPassiveBasePayload } from "../resource/ItemPassive.js";
import { Util } from "../static/Util.js";
import { Entity } from "./Entity.js";
import { EntityBaseStats, Stats } from "./EntityBaseStats.js";
import { EntitySpell } from "./EntitySpell.js";

export interface TemporaryData {
    duration: number
}

export interface StatFortification extends TemporaryData {
    name: keyof Stats
    multiplier: number
}

export interface Ailment extends TemporaryData {
    effect: Effect
}

export interface SpellCooldown extends TemporaryData {
    id: number
}

export interface PassiveCooldown extends TemporaryData {
    id: number
}

export class EntityModdedStats extends EntityBaseStats {
    public readonly fortifications = new Array<StatFortification>()
    public readonly ailments = new Array<Ailment>()
    public readonly spellCooldowns = new Array<SpellCooldown>()
    public readonly passiveCooldowns = new Array<PassiveCooldown>()

    public stunDuration = 0

    private getStatFortificationMultiplier(name: keyof Stats) {
        return this.fortifications.filter(x => x.name === name).reduce((x, y) => x + y.multiplier, 1)
    }

    public getStat(stat: keyof Stats): number {
        return this.entity.baseStats[stat] * Math.max(this.getStatFortificationMultiplier(stat), 0)
    }

    public get healRate(): number {
        return this.getStat("healRate")
    }

    public get dodgeRate(): number {
        return this.getStat("dodgeRate")
    }

    public get lifesteal(): number {
        return this.getStat("lifesteal")
    }

    public get blockReduction(): number {
        return this.getStat("blockReduction")
    }

    public get blockRate(): number {
        return this.getStat("blockRate")
    }

    public get criticalRate(): number {
        return this.getStat("criticalRate")
    }

    public get criticalMultiplier(): number {
        return this.getStat("criticalMultiplier")
    }

    public get agility(): number {
        return this.getStat("agility")
    }

    public get defense(): number {
        return this.getStat("defense")
    }

    public get maxHealth(): number {
        return this.getStat("maxHealth")
    }

    public get strength(): number {
        return this.getStat("strength")
    }

    // TODO: DON'T RESET STUN
    public stun(duration: number) {
        this.stunDuration = duration
        return new Info(this.entity, `${this.entity.displayName} has been stunned for ${Util.plural("round", duration)}!`)
    }

    public isStunned() {
        return this.stunDuration !== 0
    }

    public addFortification(fort: StatFortification) {
        this.fortifications.push(fort)
        return new Info(this.entity, `${this.entity.displayName}'s ${Util.camelToTitle(fort.name)} has ${fort.multiplier < 0 ? "decreased" : "increased"} by ${Math.abs(fort.multiplier)}x for ${Util.plural("round", fort.duration)}`)
    }

    public canCastSpell(spell: EntitySpell) {
        return !this.spellCooldowns.some(x => x.id === spell.item.id) && (!spell.item.data.chance || Util.isChance(spell.item.data.chance))
    }

    public canTriggerPassive(payload: ItemPassiveBasePayload) {
        return !this.passiveCooldowns.some(x => x.id === payload.passive.id) && payload.passive.data.criteria(payload)
    }

    public addPassiveItemCooldown(passive: ItemPassive) {
        this.passiveCooldowns.push({
            duration: passive.data.cooldown,
            id: passive.id
        })
    }

    public addSpellCooldown(spell: EntitySpell) {
        if (!spell.item.data.cooldown) return
        this.spellCooldowns.push({
            id: spell.item.id,
            duration: spell.item.data.cooldown
        })
    }

    public inflict(effect: Effect, duration: number) {
        this.ailments.push({
            duration,
            effect
        })

        return new Info(this.entity, `${this.entity.displayName} has been inflicted ${effect.simpleName} for ${Util.plural("round", duration)}!`)
    }

    private async stepOne<T extends TemporaryData>(
        arr: Array<T>,
        cycle?: (el: T) => Promise<void>
    ) {
        for (let i = 0, len = arr.length;i < len;i++) {
            const el = arr[i]
            await cycle?.(el)

            if (--el.duration === 0) {
                arr.splice(i, 1)
                i--
            }
        }
    }

    public async step(fight: Fight) {
        await this.stepOne(this.fortifications)
        await this.stepOne(this.spellCooldowns)
        await this.stepOne(this.passiveCooldowns)

        await this.stepOne(
            this.ailments,
            async eff => {
                await eff.effect.tick({
                    entity: this.entity,
                    fight,
                    effect: eff.effect
                })
            }
        )

        if (this.isStunned())
            this.stunDuration--
    }

    public reset() {
        this.fortifications.length = 0
        this.spellCooldowns.length = 0
        this.passiveCooldowns.length = 0
        this.ailments.length = 0
        this.stunDuration = 0
    }
}