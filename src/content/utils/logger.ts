export default {
	log: (...args: any[]) => console.log('[Simple Download]', ...args),
	error: (...args: any[]) => console.error('\x1b[31m[Simple Download]\x1b[0m', ...args),
}
