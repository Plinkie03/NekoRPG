export interface ILeveable {
	level: number
	xp: number

	getXpReq(): number
	addXp(xp: number): boolean
}

export class Leveable {
	private constructor() {}

	public static addXp(to: ILeveable, xp: number) {
		let leveledUp = false

		while (xp !== 0) {
			const xpReq = to.getXpReq()
			const toAdd = xp + to.xp > xpReq ? xpReq - to.xp : xp

			xp -= toAdd
			to.xp += toAdd

			if (xpReq === to.xp) {
				to.xp = 0
				to.level++
				leveledUp = true
			}
		}

		return leveledUp
	}
}
