import download from './utils/download';

Object.defineProperty(window, 'SimpleDownload', {
	enumerable: true,
	value: download,
});
