import { createApp, reactive } from 'vue';
import App from './App.vue';
import logger from './utils/logger';
import { upgrade } from './utils/upgrade_from_0.x';
import { check } from './utils/check_moekoe';
import { getCurrent } from './utils/get_song';
import download from './utils/download';
import { checkUpdate } from './utils/check_update';
import { version } from '../../package.json';
import defaultOptions from './default.json';

const checkUpdateAndNotify = async() => {
	const latestVersion = await checkUpdate(version);
	if(!latestVersion) return;
	new Notification('Simple Download 有新版本', {
		icon: 'https://assets.latedream.qzz.io/icons/moekoe_girl_cool_icon.png',
		body: `当前版本: v${version}\n最新版本: v${latestVersion}`,
		lang: 'zh-CN'
	}).addEventListener('click', () =>
		open('https://github.com/LateDreamXD/moekoe-simple-download/releases/latest'));
}

const addDlBtnToCtrls = (options: SDOptionsV1) => {
	const extraControls = document.querySelector('.player-container>.player-bar>.extra-controls')!;
	const dlBtn = extraControls.querySelector('.extra-btn')!.cloneNode() as HTMLButtonElement;
	dlBtn.innerHTML = '<i class="fas fa-download"></i>';
	dlBtn.title = '通过 Simple Download 下载当前歌曲';
	dlBtn.addEventListener('click', () => {
		const song = getCurrent();
		if(!song) {
			alert('😵 无法获取当前歌曲');
			return;
		}
		const filename = options.filename_format
			.replace('{artist}', song.author)
			.replace('{title}', song.name)
			.replace('{ext}', song.url.split('.').pop() || 'mp3');

		logger.log(`start downloading song with method ${options.download_method}:`, song);
		download[options.download_method](song.url, filename);
	});
	extraControls.insertBefore(dlBtn, extraControls.firstChild);
}

const init = async() => {
	if(!check()) { logger.log('not moekoe page, skip'); return; }
	try {
		const root = document.createElement('div');
		document.body.appendChild(root);

		upgrade(defaultOptions as SDOptionsV1);
		const options = reactive<SDOptionsV1>(JSON.parse(
			localStorage.getItem('latedream:simple_download_options') || 'null'
		) || defaultOptions);

		const app = createApp(App, { options, defaultOptions, version });
		app.mount(root);

		if(process.env.NODE_ENV === 'production')
			addDlBtnToCtrls(options);
		if(options.check_update) checkUpdateAndNotify();
	}
	catch(e: any) {logger.error('failed to inject page:', e.message, e?.stack);}
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
