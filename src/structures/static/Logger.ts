import chalk from "chalk";
import { exit } from "process";
import { inspect } from "util";

export enum LoggerColors { 
    Red = "#ff0000",
    Cyan = "#00ffff",
    White = "#ffffff",
    Yellow = "#ffe033"
}

export class Logger {
    private constructor() {}

    public static info(...messages: any[]) {
        return Logger.log("INFO", LoggerColors.Cyan, ...messages)
    }

    public static error(...messages: any[]) {
        return Logger.log("ERROR", LoggerColors.Red, ...messages)
    }

    public static warn(...messages: any[]) {
        return Logger.log("WARN", LoggerColors.Yellow, ...messages)
    }

    public static halt(...messages: any[]): never {
        Logger.log("ERROR", LoggerColors.Red, ...messages)
        exit(0)
    }

    private static log(type: string, color: string, ...messages: any[]) {
        return console.log(`[${chalk.hex(color).bold(type)} | ${chalk.greenBright.bold(new Date().toLocaleString())}]`, ...messages)
    }
}