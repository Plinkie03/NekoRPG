import { Enum, Logger, LogType } from '@nekorpg'

for (const key of Enum.keys(LogType)) {
	Logger[key.toLowerCase() as Lowercase<keyof typeof LogType>](
		`Hello! in ${key} mode`
	)
}
