import { TypedEmitter } from "tiny-typed-emitter";
import { Entity } from "../entity/Entity.js";
import { Nullable } from "../resource/Item.js";
import { Hit } from "./actions/Hit.js";
import { setTimeout } from "timers/promises";
import { Action } from "./actions/Action.js";
import { Info } from "./actions/Info.js";

export interface FightEvents {
    start(fight: Fight): any
    end(fight: Fight): any
    round(fight: Fight): any
}

export class Fight extends TypedEmitter<FightEvents> {
    public round = 1
    public maxRound = 100
    public readonly logs: Action[][] = new Array()
    private teamIndex = -1
    
    public constructor(public readonly teams: [ Entity[], Entity[] ], public readonly roundDelay = 1000) {
        super()
        this.prepare()
    }

    public getAllyTeam(entity: Entity) {
        return this.teams.find(x => x.includes(entity))!
    }

    public getEnemyTeam(entity: Entity) {
        return this.teams.find(x => !x.includes(entity))!
    }

    public getCurrentTeam() {
        return this.teams[this.teamIndex % this.teams.length]
    }

    private getAliveEntities(team: Entity[]) {
        return team.filter(x => !x.isDead())
    }

    public getWinnerTeam() {
        const alive = this.teams.filter(x => !this.isTeamDead(x))
        return alive.length === 1 ? alive[0] : null
    }

    public isTeamDead(team: Entity[]) {
        return team.every(x => x.isDead())
    }

    public getActionLog() {
        return this.logs.at(-1)!
    }

    private getNextTeam() {
        this.teamIndex++
        return this.getCurrentTeam()
    }

    private prepare() {
        for (const team of this.teams) {
            for (const entity of team) {
                entity.reset()
            }
        }
    }

    public async start() {
        this.emit("start", this)

        for (;this.getWinnerTeam() === null && this.round !== this.maxRound;this.round++) {
            if (this.round !== 1)
                await setTimeout(this.roundDelay)

            const log = this.newActionLog()

            const attackers = this.getNextTeam()
            const defenders = this.teams[(this.teamIndex + 1) % this.teams.length]

            for (const attacker of this.getAliveEntities(attackers)) {
                const aliveDefenders = this.getAliveEntities(defenders)
                const defender = aliveDefenders[Math.floor(Math.random() * aliveDefenders.length)]
                
                // If there is no defender, why are we here?
                if (!defender) break

                attack: {
                    if (attacker.moddedStats.isStunned()) {
                        log.push(new Info(attacker, `${attacker.displayName} is stunned! They can't do anything.`))    
                        break attack
                    }

                    for (const spell of attacker.getSpells()) {
                        if (!spell.canCast()) continue
                        const spellHit = Hit.fromSpell(attacker, defender, spell)

                        spell.cast({
                            fight: this,
                            hit: spellHit,
                            entity: attacker,
                            target: defender
                        })

                        spellHit.run()
                        log.push(spellHit)

                        break attack
                    }

                    const basic = Hit.from(attacker, defender)
                    basic.run()
                    log.push(basic)
                }
            }

            for (const entity of this.getEntities()) {
                if (entity.isDead()) {
                    entity.moddedStats.reset()
                    continue
                }
                
                entity.moddedStats.step(this)
            }

            this.emit("round", this)
        }

        this.emit("end", this)
    }

    private newActionLog() {
        const log = new Array<Action>()
        this.logs.push(log)
        return log
    }

    public getEntities() {
        return this.teams.flat()
    }

    public get lastLog() {
        return this.getActionLog()
    }
}
