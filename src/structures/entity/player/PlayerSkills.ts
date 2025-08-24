import { Player, SkillType, PlayerSkill } from '@nekorpg'
import { randomUUID } from 'crypto'
import { RawSkill } from '../../../../prisma/generated/index.js'

export class PlayerSkills {
	public constructor(public readonly player: Player) {}

	public get(type: SkillType): PlayerSkill {
		const existing = this.player.data.skills.find((x) => x.type === type)
		if (!existing) {
			const data: RawSkill = {
				level: 1,
				playerId: this.player.id,
				type,
				uuid: randomUUID(),
				xp: 0,
			}

			this.player.data.skills.push(data)

			return this.get(type)
		}

		return new PlayerSkill(this.player, existing)
	}

	public get defense() {
		return this.get(SkillType.Defense)
	}

	public get smithing() {
		return this.get(SkillType.Smithing)
	}

	public get wisdom() {
		return this.get(SkillType.Wisdom)
	}

	public get magic() {
		return this.get(SkillType.Magic)
	}

	public get archery() {
		return this.get(SkillType.Archery)
	}

	public get endurance() {
		return this.get(SkillType.Endurance)
	}

	public get melee() {
		return this.get(SkillType.Melee)
	}

	public get mining() {
		return this.get(SkillType.Mining)
	}

	public get woodcutting() {
		return this.get(SkillType.Woodcutting)
	}
}
