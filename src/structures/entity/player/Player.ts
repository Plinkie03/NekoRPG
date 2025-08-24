import {
	Entity,
	PlayerData,
	ILeveable,
	PlayerGear,
	PlayerInventory,
	PlayerStats,
	PlayerSkills,
	Leveable,
	Zone,
	NekoResources,
	EntitySpell,
	PlayerSpell,
	PlayerSpells,
	Passive,
	Formulas,
} from '@nekorpg'

export class Player extends Entity<PlayerData> implements ILeveable {
	public readonly gear = new PlayerGear(this)
	public readonly inventory = new PlayerInventory(this)
	public readonly stats = new PlayerStats(this)
	public readonly spells = new PlayerSpells(this)
	public readonly skills = new PlayerSkills(this)

	public get name(): string {
		return this.data.name
	}

	public get id(): string {
		return this.data.id
	}

	public get zone() {
		return NekoResources.Zones.get(this.data.zone)
	}

	public set xp(value: number) {
		this.data.xp = value
	}

	public set level(value: number) {
		this.data.level = value
	}

	public get xp() {
		return this.data.xp
	}

	public getXpReq() {
		return Formulas.xpReq(this.level, 100)
	}

	public addMoney(money: number) {
		this.data.money += money
	}

	public addGems(gems: number) {
		this.data.gems += gems
	}

	public addXp(xp: number): boolean {
		return Leveable.addXp(this, xp)
	}

	public override getSpells(): PlayerSpell[] {
		return this.spells.equipped.map((x) => new PlayerSpell(this, x))
	}

	public override getPassives(): Passive[] {
		return []
	}
}
