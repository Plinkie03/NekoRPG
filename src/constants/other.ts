import { platform } from "os";
import Time from "ms-utility"

export const EmptyString = ""
export const FileScheme = platform() === "win32" ? "file://" : EmptyString

export const TimeParser = new Time.default()