type SDOptionsV1 = {
	[x: string]: any;
	check_update: boolean;
	/** @default 'fetch' */
	download_method: 'fetch' | 'direct' | 'aria2';
	/**
	 * placeholders:
	 * - {artist}: music artist
	 * - {title}: music title
	 * - {ext}: file extension
	 * @default '{artist} - {title}.{ext}'
	 */
	filename_format: string;
	experimental_features: {
		aria2_download: boolean
	};
	aria2_options: {
		dir: string,
		/** @default 'http' */
		protocol: 'http' | 'ws',
		connection: import('@/utils/aria2').Aria2Options
	};
	version?: string;
	menuBtnPosition: {
		x: number;
		y: number;
	};
}

type SDOptionsV0 = {
	download: 'fetch' | 'direct';
}
