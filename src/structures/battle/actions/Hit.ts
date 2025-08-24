import {
	Action,
	append,
	Entity,
	Formatters,
	Formulas,
	IActionData,
	Player,
	Util,
} from '@nekorpg'
import { bold } from 'discord.js'

export interface IActionHitData extends IActionData {
	canBeFatal?: boolean
	alwaysCrit?: boolean
	alwaysDodge?: boolean
	alwaysBlock?: boolean
	skillGainDisabled?: boolean
	critDisabled?: boolean
	dodgeDisabled?: boolean
	text?: string
	damage?: number
	blockDisabled?: boolean
}

export class Hit extends Action<IActionHitData> {
	private _crit = false
	private _block = false
	private _dodge = false
	private _damage = 0

	public get damage() {
		return this.data.damage !== undefined
			? Math.floor(this.data.damage)
			: this._damage
	}

	public set damage(n: number) {
		if (!this.canBeFatal && n >= this.target.health) {
			n = this.target.health - 1
		}

		this._damage = Math.floor(n)
	}

	public constructor(data: IActionHitData) {
		super(data)
		this.prepare()
	}

	public isAlwaysCrit() {
		return !!this.data.alwaysCrit
	}

	public isAlwaysBlock() {
		return !!this.data.alwaysBlock
	}

	public isAlwaysDodge() {
		return !!this.data.alwaysDodge
	}

	public isCritDisabled() {
		return this.data.critDisabled === false
	}

	public isDodgeDisabled() {
		return this.data.dodgeDisabled === false
	}

	public isSkillGainDisabled() {
		return this.data.skillGainDisabled === true
	}

	public isBlockDisabled() {
		return this.data.blockDisabled === false
	}

	public get canBeFatal() {
		return this.data.canBeFatal ?? true
	}

	public get crit() {
		return this._crit
	}

	public get block() {
		return this._block
	}

	public get dodge() {
		return this._dodge
	}

	public set crit(v: boolean) {
		this._crit = v
		this.prepare()
	}

	public set block(v: boolean) {
		this._block = v
		this.prepare()
	}

	public set dodge(v: boolean) {
		this._dodge = v
		this.prepare()
	}

	public prepare() {
		this._crit =
			this.isAlwaysCrit() ||
			Util.isChance(this.entity.stats.modded.criticalRate)
		this._dodge = this.isAlwaysDodge() || Util.isChance(0)
		this._block =
			this.isAlwaysBlock() ||
			Util.isChance(this.target.stats.modded.blockRate)

		let baseDamage = Formulas.randomInt(
			this.entity.stats.modded.strength * 0.8,
			this.entity.stats.modded.strength * 1.2
		)

		if (this._crit) {
			baseDamage *= this.entity.stats.modded.criticalMultiplier
		}

		if (this._block) {
			baseDamage *=
				1 - Math.min(1, this.target.stats.modded.blockReduction)
		}

		// Apply all dmg res
		baseDamage *= 1 - Math.min(1, this.target.stats.modded.damageResistance)

		// Apply the using weapon res
		baseDamage *=
			1 -
			Math.min(
				1,
				this.target.stats.modded[
					append(this.entity.stats.offensiveStat, 'Resistance')
				]
			)

		this.damage = Math.floor(baseDamage)
	}

	public override beforeExecute(): void {
		this.target.damage(this.damage)

		// Is skill gain allowed in this hit?
		if (!this.isSkillGainDisabled()) {
			if (this.entity instanceof Player) {
				this.entity.skills[this.entity.stats.offensiveStat].addXp(5)
				this.entity.skills.endurance.addXp(3)
			} else if (this.target instanceof Player) {
				this.target.skills.defense.addXp(3)
				this.target.skills.endurance.addXp(5)
			}
		}
	}

	public setNeverFatal() {
		this.data.canBeFatal = false

		// Adjust the damage
		this.damage = this.damage
	}

	public isFatal() {
		return this.damage >= this.target.health
	}

	public override toString(): string {
		return (
			`${
				this.data.text
					? this.data.text
					: `${this.entity} landed a hit on ${this.target}!`
			} (${this.damage === 0 ? '' : '-'}${Formatters.int(this.damage)})` +
			super.toString()
		)
	}
}
