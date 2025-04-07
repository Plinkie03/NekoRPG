import { join, resolve } from 'path';
import { NekoClient } from './NekoClient.js';
import { readdirSync } from 'fs';
import { Importer } from '../structures/util/Importer.js';
import { Interaction } from '../structures/discord/Interaction.js';
import { Collection } from 'discord.js';

export class NekoInteractions {
    private static readonly _Path = resolve('dist', 'interactions');

    private readonly _interactions = new Collection<number, Interaction>();

    public constructor(private readonly _client: NekoClient) {};

    public get(id: number) {
        return this._interactions.get(id);
    }

    public async load() {
        for (
            const file of readdirSync(NekoInteractions._Path, { recursive: true, withFileTypes: true }).filter(x => x.isFile())
        ){
            const interaction = await Importer.import<Interaction>(join(file.path, file.name));
            if (this._interactions.has(interaction.data.id)) {
                throw new Error(`Interaction id ${interaction.data.id} already exists`);
            }
            this._interactions.set(interaction.data.id, interaction);
        };
    };
};