import { Colors } from 'discord.js'
import { platform } from 'os'

export const FileScheme = platform() === 'win32' ? 'file://' : ''
export const PrimaryColor = Colors.Aqua
