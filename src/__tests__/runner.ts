import { argv } from "process";
import { NekoDatabase } from "../core/NekoDatabase.js";

NekoDatabase.$connect().then(
    () => import(`./${argv.slice(2).join("_")}.js`)
)