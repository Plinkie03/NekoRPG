import { NekoDatabase } from "../core/NekoDatabase.js";

NekoDatabase.rawPlayer._getById("123").then(async pl => {
    await NekoDatabase.rawItem.add({ id: 1, playerId: pl.id })
    console.log(pl)
})