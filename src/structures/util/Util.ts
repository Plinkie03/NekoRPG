import { Static } from './Static.js';

export class Util extends Static {
    public static searchMany<T>(
        iterable: Array<T> | Map<unknown, T>,
        query: string,
        properties: (keyof T)[],
    ): T[] {
        query = query.toLowerCase();

        const results = new Array<T>();

        for (const element of iterable.values()) {
            for (const prop of properties) {
                const value = element[prop]?.toString()?.toLowerCase();
                if (value && (value === query || value.endsWith(query) || value.startsWith(query))) {
                    results.push(element);
                }
            }
        }

        return results;
    }

    public static searchOne<T>(
        ...params: Parameters<typeof Util.searchMany<T>>
    ): T | null {
        return Util.searchMany(...params)[0] ?? null;
    }
}