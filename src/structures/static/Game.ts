import { Collection } from "discord.js";
import { NekoResources } from "../../core/NekoResources.js";
import { Logger } from "./Logger.js";
import { join } from "path";
import { Effect } from "../resource/Effect.js";
import { Item, ItemType } from "../resource/Item.js";
import { Node } from "../resource/node/Node.js";
import { Zone } from "../resource/Zone.js";
import { Resource } from "../resource/Resource.js";
import { Util } from "./Util.js";
import { Quest } from "../resource/Quest.js";
import { Monster } from "../monster/Monster.js";
import { ItemPassive } from "../resource/ItemPassive.js";
import { NekoResourceCache } from "../../core/NekoResourceCache.js";

export type Identifiable<T = unknown> = T & { id: number }

export class Game {
    public static Items: NekoResourceCache<Item>
    public static Monsters: NekoResourceCache<Monster>
    public static Passives: NekoResourceCache<ItemPassive>
    public static Nodes: NekoResourceCache<Node>
    public static Zones: NekoResourceCache<Zone>
    public static Quests: NekoResourceCache<Quest>
    public static Effects: NekoResourceCache<Effect>

    private static readonly ResourcePath = join("dist", "resources")
    private static readonly ItemPath = join(this.ResourcePath, "item")
    private static readonly ZonePath = join(this.ResourcePath, "zone")
    private static readonly NodePath = join(this.ResourcePath, "node")
    private static readonly EffectPath = join(this.ResourcePath, "effect")
    private static readonly QuestPath = join(this.ResourcePath, "quest")
    private static readonly MonsterPath = join(this.ResourcePath, "monster")
    private static readonly PassivePath = join(this.ResourcePath, "passive")

    private constructor() {}

    public static async init() {
        this.Items = await NekoResourceCache.fromPath(Game.ItemPath)
        this.Nodes = await NekoResourceCache.fromPath(Game.NodePath)
        this.Effects = await NekoResourceCache.fromPath(Game.EffectPath)
        this.Zones = await NekoResourceCache.fromPath(Game.ZonePath)
        this.Monsters = await NekoResourceCache.fromPath(Game.MonsterPath)
        this.Quests = await NekoResourceCache.fromPath(Game.QuestPath)
        this.Passives = await NekoResourceCache.fromPath(Game.PassivePath)
    }
}