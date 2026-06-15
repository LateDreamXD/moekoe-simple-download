import { check } from './utils/check_moekoe';
import download from './utils/download';

const checkResult = check();
if(checkResult.isMoekoeApp || checkResult.isMoekoeWeb)
	Object.defineProperty(window, 'SimpleDownload', {
		writable: false,
		enumerable: true,
		value: download,
	});
