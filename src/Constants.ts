import { Colors } from 'discord.js'
import { platform } from 'os'

export const FileScheme = platform() === 'win32' ? 'file://' : ''
export const PrimaryColor = Colors.Aqua
export const NoImageFound =
	'https://cdn.discordapp.com/avatars/1104838193276268705/ad5f179d35ae4ee4ba5334367144a2be.webp?size=1024'
