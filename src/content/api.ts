import download from './utils/download';
import get_song from './utils/get_song';

Object.defineProperty(window, 'SimpleDownload', {
	writable: false,
	enumerable: true,
	value: {
		download,
		song: get_song
	}
});

export type SDApi = {
	download: typeof download,
	song: typeof get_song
};
