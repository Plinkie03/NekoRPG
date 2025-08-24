import { GearItem, Logger, NekoDatabase, PlayerInventoryItem } from '@nekorpg'

NekoDatabase.$connect().then(async () => {
	const pl = await NekoDatabase.rawPlayer.getByUserId('123')
	const sword = pl.inventory.items.at(-1) as PlayerInventoryItem<GearItem>
	Logger.info(pl.zone.data.gather![0].consume(pl))
})
