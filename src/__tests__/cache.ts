import { Cache } from "../structures/util/Cache.js";

const cache = new Cache<string, number>(3000)

cache.on("expire", console.log)

cache.set("123", 1)
