import auth from './auth';
import logger from './logger';

const QUALITY_LEVELS = ['128', '320', 'flac', 'high', 'viper_atmos', 'viper_clear', 'viper_tape'];
// const QUALITY_LABELS = {
//     '128': '标准',
//     '320': '高品',
//     flac: 'FLAC',
//     high: 'Hi-Res',
//     viper_atmos: '全景声',
//     viper_clear: '超清',
//     viper_tape: '母带'
// };

const getCurrent = (): {
	name: string,
	author: string,
	img: string,
	url: string,
	hash: string
}|null => {
	const current_song = localStorage.getItem('current_song');
	if(current_song) return JSON.parse(current_song);
	else return null;
}
const normalizeQuality = (quality: string) => QUALITY_LEVELS.includes(quality) ? quality : '128';

// const getFallbackChain = (quality: string) => QUALITY_LEVELS.slice(0, QUALITY_LEVELS.indexOf(normalizeQuality(quality)) + 1).reverse();

const getByHash = async (hash: string) => {
	const settings = JSON.parse(localStorage.getItem('settings') || '{}');
	const res = await fetch('http://127.0.0.1:6521/song/url', auth({
		hash,
		quality: normalizeQuality(settings?.quality),
		ppage_id: '356753938'
	}));

	if (res.url && res.url[0]) return res.url[0];
	else {
		logger.error('can not get song url');
		return false;
	}
}

export { getCurrent, getByHash };
export default {
	getCurrent, getByHash
};
