/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationCommandOptionType } from 'discord.js';
import { NekoClient } from '../../core/NekoClient.js';

export enum ArgType {
    String,
    Float,
    Integer,
    Enum
}

export type EnumLike<T = any> = {
    [id: string]: T | string;
    [nu: number]: string;
}

export type GetEnum<T> = T extends EnumLike<infer P> ? P : never

export type Nullable<T> = T | null
export type UnwrapArgType<
    T extends ArgType,
    Enum extends EnumLike
> = T extends ArgType.Enum ? GetEnum<Enum>: T extends ArgType.String ? string : number

export type MarkNullable<Value, IsRequired extends boolean> = IsRequired extends true ? Value : Nullable<Value>

export type UnwrapArg<Arg> = Arg extends IBaseArgData<infer Type, any, infer Enum>
    ? MarkNullable<UnwrapArgType<Type, Enum>, Arg['required'] extends true ? true : false>
    : never;

export type UnwrapArgs<Args> = Args extends [
    infer L,
    ...infer R
] ? [
    UnwrapArg<L>,
    ...UnwrapArgs<R>
] : []

export interface IBaseHandlerExecutionData<Interaction = any, Args = any> {
    extras: unknown
    interaction: Interaction
    args: UnwrapArgs<Args>
}

export interface IBaseHandlerData<
    Args extends [...IBaseArgData[]] = IBaseArgData[],
    ExecMethodData extends IBaseHandlerExecutionData = IBaseHandlerExecutionData
> {
    args?: [...Args]
    execute: (this: NekoClient, ctx: ExecMethodData) => Promise<boolean>
}

export interface IBaseArgData<
    Type extends ArgType = ArgType,
    Required extends boolean = boolean,
    Enum extends EnumLike = EnumLike
> {
    required?: Required
    type: Type
    enum?: Enum
}

export abstract class BaseHandler<Data> {
    public constructor(public readonly data: Data) {}

    public static getDiscordArgType(type: ArgType): ApplicationCommandOptionType {
        switch (type) {
            case ArgType.Float:
                return ApplicationCommandOptionType.Number;

            case ArgType.Enum:
            case ArgType.Integer:
                return ApplicationCommandOptionType.Integer;

            case ArgType.String:
                return ApplicationCommandOptionType.String;

            default:
                // TODO: Actually have a fallback
                throw new Error(`Unhandled ArgType: ${type}`);
        }
    }
}