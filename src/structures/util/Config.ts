import { config } from 'dotenv';
import { env } from 'process';
import { Static } from './Static.js';

config();

export class Config extends Static {
    public static get token(): string {
        return env.BOT_TOKEN as string;
    }
}