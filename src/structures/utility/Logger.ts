import chalk from 'chalk'

export enum LogType {
	Info,
	Success,
	Warn,
	Error,
}

export const LogColors: Record<LogType, string> = {
	[LogType.Error]: '#ff0000',
	[LogType.Success]: '#00ff00',
	[LogType.Info]: '#00ffff',
	[LogType.Warn]: '#ffff00',
}

export class Logger {
	private constructor() {}

	private static _log(type: LogType, ...msg: unknown[]) {
		console.log(
			chalk.bold.hex(LogColors[type])(
				`[${new Date().toLocaleString()} (${LogType[type]})]`
			),
			...msg
		)
	}

	public static success(...msg: unknown[]) {
		return this._log(LogType.Success, ...msg)
	}

	public static warn(...msg: unknown[]) {
		return this._log(LogType.Warn, ...msg)
	}

	public static info(...msg: unknown[]) {
		return this._log(LogType.Info, ...msg)
	}

	public static error(...msg: unknown[]) {
		return this._log(LogType.Error, ...msg)
	}
}
