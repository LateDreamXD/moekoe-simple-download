import Aria2 from '@baptistecdr/aria2';

export type Aria2Options = {
	/** @default 'localhost' */
	host?: string,
	/** @default 6800 */
	port?: number,
	/** @default location.protocol === 'https:' */
	secure?: boolean,
	/** @default '' */
	secret?: string,
	/** @default '/jsonrpc' */
	path?: string
}

export const createAria2 = (options: Aria2Options) => new Aria2({
	host: 'localhost',
	port: 6800,
	secure: location.protocol === 'https:',
	secret: '',
	path: '/jsonrpc',
	...options
});

export const changeProtocol = async (aria2: Aria2, protocol: 'http' | 'ws') => {
	if(protocol === 'http' && aria2.socket) await aria2.close();
	if(protocol === 'ws' && !aria2.socket) await aria2.open();
}

export default {
	createAria2,
	changeProtocol
}
