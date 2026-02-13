type SDOptionsV1 = {
	check_update: boolean;
	/** @default 'fetch' */
	download_method: 'fetch' | 'direct';
	/**
	 * placeholders:
	 * - {artist}: music artist
	 * - {title}: music title
	 * - {ext}: file extension
	 * @default '{artist} - {title}.{ext}'
	 */
	filename_format: string;
	experimental_features: {}
	version?: string;
}

type SDOptionsV0 = {
	download: 'fetch' | 'direct';
}
