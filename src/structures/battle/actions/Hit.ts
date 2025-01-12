import { Entity, IEntity } from "../../entity/Entity.js";
import { EntityBaseStats } from "../../entity/EntityBaseStats.js";
import { EntitySpell } from "../../entity/EntitySpell.js";
import { Player } from "../../player/Player.js";
import { Skills, SkillType } from "../../player/PlayerSkills.js";
import { GearType } from "../../resource/Item.js";
import { Formulas } from "../../static/Formulas.js";
import { Util } from "../../static/Util.js";
import { Action } from "./Action.js";
import { Heal } from "./Heal.js";
import { Info } from "./Info.js";

export class Hit extends Action {
    public finalDamage!: number
    public blocked!: boolean
    public dodged!: boolean
    public crit!: boolean
    private customMessage?: string
    private appends = new Array<string>()
    private hideAttacker = false
    private ignoreSpecials = false
    
    public constructor(
        attacker: Entity,
        public readonly defender: Entity,
        private multiplier = 1
    ) {
        super(attacker)
    }

    protected get entities(): Entity<IEntity<any>, EntityBaseStats>[] {
        return [ ...super.entities, this.defender ]
    }

    protected prepare() {
        this.dodged = !this.ignoreSpecials && (Util.isChance(this.defender.moddedStats.dodgeRate) || Util.isChance(this.entity.moddedStats.agility / this.defender.moddedStats.agility * 100))
        this.blocked = !this.ignoreSpecials && !this.dodged && Util.isChance(this.defender.moddedStats.blockRate)
        this.crit = !this.ignoreSpecials && !this.dodged && Util.isChance(this.entity.moddedStats.criticalRate)

        this.damage = this.calculateDamage()
    }

    public set damage(n: number) {
        this.finalDamage = Math.floor(n)
    }

    public get damage() {
        return this.finalDamage
    }

    public setMultiplier(mult: number) {
        this.multiplier = mult
        return this
    }

    public setAttackerVisibility() {
        this.hideAttacker = true
        return this
    }

    public setIgnoreSpecials() {
        this.ignoreSpecials = true
        return this
    }

    public setMessage(str: string) {
        this.customMessage = str
        return this
    }

    private calculateDamage() {
        if (this.dodged) {
            return 0
        }

        let finalDamage = Formulas.random(this.entity.moddedStats.minDamage, this.entity.moddedStats.maxDamage) * this.multiplier

        if (this.crit) {
            finalDamage *= (this.entity.moddedStats.criticalMultiplier / 100)
        }

        if (this.blocked) {
            finalDamage *= (1 - this.defender.moddedStats.blockReduction / 100)
        }

        return Math.floor(finalDamage)
    }

    public append(str: string) {
        this.appends.push(str)
        return this
    }

    protected get message() {
        const output = new Array<string>()

        if (this.customMessage)
            output.push(this.customMessage)
        else {
            if (!this.hideAttacker) {
                output.push(
                    this.entity.displayName,
                    " "
                )
            }

            output.push(
                this.dodged ? `tried to attack` : `landed a${this.crit ? " critical " : " "}hit on `,
                this.defender.displayName
            )

            if (this.blocked)
                output.push(` but the hit was blocked, reducing the damage!`)
        }

        output.push(` (-${Util.formatInt(this.damage)})`, ...this.appends.map(x => ` ${x}`))
        
        return output.join("")
    }

    private async addSkillPoints(entity: Entity, multipliers: Partial<Skills>) {
        if (!this.damage) return

        // One of the entities must not be a player
        // In PVP, this shall not be executed
        if (entity instanceof Player && this.entities.some(x => !(x instanceof Player))) {
            const results = await entity.give({
                hideIrrelevant: true,
                rewards: {
                    skills: [
                        { type: SkillType.Defense, xp: this.damage * (multipliers[SkillType.Defense] ?? 0) },
                        { type: SkillType.Melee, xp: this.damage * (multipliers[SkillType.Melee] ?? 0) },
                        { type: SkillType.Endurance, xp: this.damage * (multipliers[SkillType.Endurance] ?? 0) }
                    ]
                }
            })

            this.addMany(...Info.fromMany(entity, results))
        }
    }

    protected async execute() {
        const stolen = this.damage * (this.entity.moddedStats.lifesteal / 100)
        if (stolen > 1) {
            this.actions.push(new Heal(this.entity, stolen))
        }

        await this.addSkillPoints(this.entity, {
            [SkillType.Endurance]: 0.75,
            [SkillType.Melee]: 1
        })

        await this.addSkillPoints(this.defender, {
            [SkillType.Endurance]: 1,
            [SkillType.Defense]: 0.75
        })

        this.defender.damage(this.damage)
    }

    public static from(attacker: Entity, defender: Entity) {
        return new Hit(attacker, defender)
    }
}