import logger from './logger';

export const upgrade = (defaultOptions: SDOptionsV1) => {
	const legacy: SDOptionsV0 | null = JSON.parse(
		localStorage.getItem('simple-download-option') || 'null'
	);
	if(!legacy) return null;
	logger.log('find legacy option, upgrading...');
	localStorage.removeItem('simple-download-option');
	const converted: SDOptionsV1 = {
		...defaultOptions,
		download_method: legacy.download,
		version: '0.x'
	};
	localStorage.setItem('latedream:simple_download_options', JSON.stringify(converted));
	logger.log('upgraded options');
	return converted;
}
