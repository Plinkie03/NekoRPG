import { argv } from "process";
import NekoDatabase from "../core/NekoDatabase.js";
import { Game } from "../structures/static/Game.js";

Game.init().then(() => NekoDatabase.$connect().then(() => import(`./${argv.slice(2).join(" ")}.js`)))