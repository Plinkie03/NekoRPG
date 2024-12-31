import { Fight } from "../battle/Fight.js";
import { Info } from "../battle/actions/Info.js";
import { Effect, EffectData } from "../resource/Effect.js";
import { Util } from "../static/Util.js";
import { Entity } from "./Entity.js";
import { EntityBaseStats, Stats } from "./EntityBaseStats.js";
import { EntitySpell } from "./EntitySpell.js";

export interface StatFortification {
    name: keyof Stats
    duration: number
    multiplier: number
}

export interface Ailment {
    duration: number
    effect: Effect
}

export interface SpellCooldown {
    id: number
    duration: number
}

export class EntityModdedStats extends EntityBaseStats {
    public readonly fortifications = new Array<StatFortification>()
    public readonly ailments = new Array<Ailment>()
    public readonly spellCooldowns = new Array<SpellCooldown>()
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

    public step(fight: Fight) {
        for (let i = 0;i < this.fortifications.length;i++) {
            const fort = this.fortifications[i]
            if (--fort.duration === 0) {
                this.fortifications.splice(i, 1)
                i--
            }
        }

        for (let i = 0;i < this.spellCooldowns.length;i++) {
            const cd = this.spellCooldowns[i]
            if (--cd.duration === 0) {
                this.spellCooldowns.splice(i, 1)
                i--
            }
        }

        for (let i = 0;i < this.ailments.length;i++) {
            const eff = this.ailments[i]
            
            eff.effect.tick({
                entity: this.entity,
                fight,
                effect: eff.effect
            })

            if (--eff.duration === 0) {
                this.ailments.splice(i, 1)
                i--
            }
        }

        if (this.isStunned())
            this.stunDuration--
    }

    public reset() {
        this.fortifications.length = 0
        this.spellCooldowns.length = 0
        this.ailments.length = 0
        this.stunDuration = 0
    }
}