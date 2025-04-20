import { Nullable } from '../discord/BaseHandler.js';

export interface IResourceData {
    id: number | string
    name: string
    emoji?: Nullable<string>
    description?: string
}

export abstract class Resource {
    public constructor(public readonly data: IResourceData) {}

    public get id() {
        return this.data.id;
    }

    public get name() {
        return this.data.name;
    }

    public get description() {
        return this.data.description ?? null;
    }

    public get emoji() {
        return this.data.emoji ?? null;
    }
}