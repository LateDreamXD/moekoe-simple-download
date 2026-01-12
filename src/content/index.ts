import logger from './modules/logger';
import { injectBtn, injectMenu } from './modules/inject';

const init = () => {
	try {injectBtn(injectMenu());}
	catch(e: any) {logger.error('failed to inject page:', e.message, e?.stack);}
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
