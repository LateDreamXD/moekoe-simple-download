import { hook, unHook } from 'xhr-hook-cycle';

const init = (path: string, cb: (rawText: string) => void) => {
	hook({
		onreadystatechange(xhr, ev) {
			if(!xhr.responseURL.includes(path)) return false;
			if(xhr.readyState === 4)
				cb(xhr.responseText);
			return false;
		},
	})
}

export default {
	init,
	restore: unHook
}
