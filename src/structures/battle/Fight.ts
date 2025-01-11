import { TypedEmitter } from "tiny-typed-emitter";
import { Entity } from "../entity/Entity.js";
import { Nullable } from "../resource/Item.js";
import { Hit } from "./actions/Hit.js";
import { setTimeout } from "timers/promises";
import { Action } from "./actions/Action.js";
import { Info } from "./actions/Info.js";
import { Monster } from "../monster/Monster.js";
import { Player } from "../player/Player.js";
import NekoDatabase from "../../core/NekoDatabase.js";
import { Collection } from "discord.js";
import { SpellCast } from "./actions/SpellCast.js";

type FightFunction = (fight: Fight) => any

export interface FightEvents {
    round: FightFunction[]
}

export interface FightOptions {
    roundDelay: number
    roundTimes: number
    maxRound: number
}

export class Fight {
    public round = 1
    public readonly logs: Action[][] = new Array()
    public readonly rewards = new Collection<Player, string[]>()
    private teamIndex = -1
    public readonly options: FightOptions
    private readonly events: FightEvents = {
        round: []
    }

    public constructor(public readonly teams: [Entity[], Entity[]], options: Partial<FightOptions> = {}) {
        this.options = {
            maxRound: 100,
            roundDelay: 2500,
            roundTimes: 2,
            ...options
        }
    }
    
    public on(name: keyof FightEvents, listener: FightFunction) {
        this.events[name].push(listener)
    }

    public async emit(name: keyof FightEvents, ...params: Parameters<FightFunction>) {
        for (const event of this.events[name]) {
            await event(...params)
        }
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
        for (const entity of this.getEntities()) {
            entity.reset()
            entity.on("dead", this.onEntityDead.bind(this))
        }
    }

    private async finish() {
        await this.addWinnerRewards()

        for (const entity of this.getEntities()) {
            entity.removeAllListeners()

            if (entity instanceof Player)
                await entity.save()
        }

        Reflect.deleteProperty(this, "events")
    }

    private async step() {
        for (const entity of this.getEntities()) {
            if (entity.isDead()) {
                entity.moddedStats.reset()
                continue
            }

            entity.moddedStats.step(this)
        }

        if (!this.ended) {
            if (this.round % this.options.roundTimes === 0) {
                await this.emit("round", this)
                await setTimeout(this.options.roundDelay)
            }
        }
    }

    public get ended() {
        return !(this.getWinnerTeam() === null && this.isAnyTeamAlive() && this.round !== this.options.maxRound)
    }

    public async start() {
        this.prepare()

        do {
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
                        const spellCast = new SpellCast(attacker, defender, spell)

                        spell.cast({
                            fight: this,
                            cast: spellCast,
                            entity: attacker,
                            target: defender
                        })

                        await spellCast.run()

                        log.unshift(spellCast)

                        break attack
                    }

                    const basic = Hit.from(attacker, defender)
                    await basic.run()
                    log.unshift(basic)
                }
            }

            await this.step()

            this.round++
        } while (!this.ended)

        await this.finish()
    }

    private newActionLog() {
        const log = new Array<Action>()
        this.logs.push(log)
        return log
    }

    public isAnyTeamAlive() {
        return this.teams.some(x => !!this.getAliveEntities(x).length)
    }

    public getPlayersInTeam(team: Nullable<Entity[]>) {
        return team ? team.filter(x => x instanceof Player) : null
    }

    public getMonstersInTeam(team: Nullable<Entity[]>) {
        return team ? team.filter(x => x instanceof Monster) : null
    }

    public getPlayers() {
        return this.getEntities().filter(x => x instanceof Player)
    }

    public getMonsters() {
        return this.getEntities().filter(x => x instanceof Monster)
    }

    public getEntities() {
        return this.teams.flat()
    }

    public get lastLogs() {
        return this.logs.slice(-this.options.roundTimes)
    }

    public get lastLog() {
        return this.getActionLog()
    }

    private onEntityDead(entity: Entity) {
        this.lastLog.push(new Info(entity, `${entity.displayName} died...`))
    }

    /**
     * DOES NOT SAVE TO DB
     * @returns 
     */
    private async addWinnerRewards() {
        const winners = this.getPlayersInTeam(this.getWinnerTeam())
        if (!winners?.length) return

        const losers = this.getMonstersInTeam(this.getEnemyTeam(winners[0]))
        if (!losers?.length) return

        for (const player of winners) {
            for (const monster of losers) {
                this.rewards.ensure(player, () => []).push(...(await monster.loot({ player, doNotSave: true })))
            }
        }
    }
}
