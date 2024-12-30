import { readdirSync } from "fs"
import { join } from "path"
import { cwd } from "process"

export class NekoResources {
    private constructor() {}

    private static async loadOne<T>(filePath: string): Promise<T[]> {
        const data = await import(`file://${filePath}`)
        return [ data.default ]
    }

    public static async loadAll<T>(path: string): Promise<T[]> {
        const arr = new Array<T>()

        for (const file of readdirSync(path, { recursive: true, withFileTypes: true, encoding: 'utf-8' })) {
            if (file.isDirectory()) continue
            const requirePath = join(cwd(), file.path, file.name)
            arr.push(...(await NekoResources.loadOne<T>(requirePath)))
        }

        return arr
    }
}