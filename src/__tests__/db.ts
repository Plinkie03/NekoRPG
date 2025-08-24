import { GearItem, NekoDatabase, PlayerInventoryItem } from '@nekorpg'

NekoDatabase.$connect().then(async () => {
	const pl = await NekoDatabase.rawPlayer.getByUserId('123')
	const sword = pl.inventory.items.at(-1) as PlayerInventoryItem<GearItem>
	console.log(pl.zone.data.gather![0].consume(pl))
})
