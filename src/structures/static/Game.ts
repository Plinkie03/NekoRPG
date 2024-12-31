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

export type Identifiable<T = unknown> = T & { id: number }

export class Game {
    public static readonly RawItems = new Array<Item>()
    public static readonly Items = new Collection<number, Item>()
    
    public static readonly RawMonsters = new Array<Monster>()
    public static readonly Monsters = new Collection<number, Monster>()

    public static readonly RawNodes = new Array<Node>()
    public static readonly Nodes = new Collection<number, Node>()

    public static readonly RawZones = new Array<Zone>()
    public static readonly Zones = new Collection<number, Zone>()
    
    public static readonly RawQuests = new Array<Quest>()
    public static readonly Quests = new Collection<number, Quest>()
    
    public static readonly RawSpells = new Array<Effect>()
    public static readonly Spells = new Collection<number, Effect>()

    private static readonly ResourcePath = join("dist", "resources")
    private static readonly ItemPath = join(this.ResourcePath, "item")
    private static readonly ZonePath = join(this.ResourcePath, "zone")
    private static readonly NodePath = join(this.ResourcePath, "node")
    private static readonly EffectPath = join(this.ResourcePath, "effect")
    private static readonly QuestPath = join(this.ResourcePath, "quest")
    private static readonly MonsterPath = join(this.ResourcePath, "monster")

    private constructor() {}

    public static async init() {
        await Game.load(Game.ItemPath, Game.RawItems, Game.Items)
        await Game.load(Game.NodePath, Game.RawNodes, Game.Nodes)
        await Game.load(Game.EffectPath, Game.RawSpells, Game.Spells)
        await Game.load(Game.ZonePath, Game.RawZones, Game.Zones)
        await Game.load(Game.MonsterPath, Game.RawMonsters, Game.Monsters)
        await Game.load(Game.QuestPath, Game.RawQuests, Game.Quests)
    }

    private static async load<T extends Identifiable>(path: string, rawRef: Array<T>, ref: Collection<number, T>) {
        const resources = await NekoResources.loadAll<T>(path)
        for (let i = 0, len = resources.length;i < len;i++) {
            const resource = resources[i]
            
            if (ref.has(resource.id)) {
                Logger.halt(`Id ${resource.id} already registered for elements of type ${resource.constructor.name}`)
            }


            ref.set(resource.id, resource)
            rawRef.push(resource)
        }

        if (resources.length !== 0) {
            Logger.info(`Loaded ${rawRef.length} elements of type ${resources[0].constructor.name}`)
        }
    }

    public static getItem<T extends ItemType = ItemType>(id: number) {
        const itm = Game.Items.get(id) as Item<T>
        if (!itm) Logger.halt(`Item with id ${id} does not exist!`)
        return itm
    }

    public static getNode(id: number) {
        const node = Game.Nodes.get(id)
        if (!node) Logger.halt(`Node with id ${id} does not exist!`)
        return node
    }

    public static getZone(id: number) {
        const zone = Game.Zones.get(id)
        if (!zone) Logger.halt(`Zone with id ${id} does not exist!`)
        return zone
    }

    public static getSpell(id: number) {
        const eff = Game.Spells.get(id)
        if (!eff) Logger.halt(`Effect with id ${id} does not exist!`)
        return eff
    }

    public static getQuest(id: number) {
        const quest = Game.Quests.get(id)
        if (!quest) Logger.halt(`Quest with id ${id} does not exist!`)
        return quest
    }

    public static getMonster(id: number) {
        const mob = Game.Monsters.get(id)
        if (!mob) Logger.halt(`Monster with id ${id} does not exist!`)
        return mob
    }

    public static search(on: Array<Resource>, query: string) {
        return Util.searchMany(
            on,
            query,
            el => el.id,
            el => el.name
        )
    }
}