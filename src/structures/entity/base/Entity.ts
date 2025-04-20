import { Resource } from '../../resource/Resource.js';

export abstract class Entity extends Resource {
    public abstract get id(): string | number
    public abstract get name(): string
}