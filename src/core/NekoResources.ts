import {
	NekoResourceHolder,
	BaseItem,
	Monster,
	Zone,
	Passive,
	Effect,
} from '@nekorpg'

export class NekoResources {
	public static readonly Items = new NekoResourceHolder<BaseItem>('items')
	public static readonly Monsters = new NekoResourceHolder<Monster>(
		'monsters'
	)
	public static readonly Passives = new NekoResourceHolder<Passive>(
		'passives'
	)
	public static readonly Zones = new NekoResourceHolder<Zone>('zones')
	public static readonly Effects = new NekoResourceHolder<Effect>('effects')

	private constructor() {}

	public static async init() {
		await NekoResources.Items.load()
		await NekoResources.Monsters.load()
		await NekoResources.Passives.load()
		await NekoResources.Zones.load()
	}
}
