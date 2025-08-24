import { Cache } from '@nekorpg'

const cache = new Cache<string, string>()

cache.set('hello', 'bye')
cache.on('expire', console.log)
