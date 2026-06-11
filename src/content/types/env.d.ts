import { SDApi } from '@/api';

declare global {
	const isProd: boolean;
	interface Window {
		SimpleDownload: SDApi;
		SimpleDownloadShared: {
			songList: any[]
		}
	}
}
