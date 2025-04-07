import { FileScheme } from '../../constants/other.js';
import { Static } from './Static.js';

export class Importer extends Static {
    public static async import<T>(path: string) {
        return import(FileScheme + path).then(x => 'default' in x ? x.default : x) as T;
    }
}