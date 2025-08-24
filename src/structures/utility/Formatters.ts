export class Formatters {
	private constructor() {}

	public static int(n: number) {
		return n.toLocaleString()
	}

	public static float(n: number) {
		return n.toFixed(2).replace(/.00$/, '')
	}

	public static multiplier(n: number) {
		return Formatters.float(n) + 'x'
	}

	public static percentual(n: number) {
		return Formatters.float(n * 1e2) + '%'
	}

	public static script(n: string) {
		return `- ${n}`
	}

	public static camelToTitle(str: string) {
		return str
			.replace(/([A-Z])/g, ' $1') // insert space before capitals
			.replace(/^./, (s) => s.toUpperCase()) // capitalize first letter
	}

	public static toTitleCase(t: string) {
		return t
			.split(/ +/g)
			.map((x) => x[0].toUpperCase() + x.slice(1))
			.join(' ')
	}
}
