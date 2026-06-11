import { ref } from 'vue';
import logger from './logger';

const callback = ref<((target: HTMLDivElement) => void) | null>(null);

const listener = (e: PointerEvent) => {
	const target = document.querySelector<HTMLDivElement>('.context-menu');
	if (target) {
		logger.log('found contextmenu');
		callback.value?.(target);
	}
}

const init = (cb?: (target: HTMLDivElement) => void) => {
	callback.value = cb || null;
	window.addEventListener('contextmenu', listener);
}

const restore = () => {
	window.removeEventListener('contextmenu', listener);
}

export default {
	callback,
	init,
	restore
}
