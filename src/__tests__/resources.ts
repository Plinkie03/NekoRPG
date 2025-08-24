import { BaseItem, Logger, Resource } from '@nekorpg'

Resource.load<BaseItem>('items').then((x) =>
	x
		.sort((x, y) => x.price - y.price)
		.forEach((x) => Logger.info(x.name, x.price))
)
