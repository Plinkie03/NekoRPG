export function append<A extends string, B extends string>(a: A, b: B) {
	return (a + b) as `${A}${B}`
}
