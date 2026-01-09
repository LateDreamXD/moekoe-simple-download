import logger from './libs/logger';
import { injectBtn, injectMenu } from './libs/inject';

const init = () => {
	try {injectBtn(injectMenu());}
	catch(e: any) {logger.error('failed to inject page:', e.message, e?.stack);}
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
