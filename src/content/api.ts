import download from './utils/download';

Object.defineProperty(window, 'SimpleDownload', {
	writable: false,
	enumerable: true,
	value: download,
});
