import { BaseItem, Resource } from '@nekorpg'

Resource.load<BaseItem>('items').then((x) =>
	x
		.sort((x, y) => x.price - y.price)
		.forEach((x) => console.log(x.name, x.price))
)
