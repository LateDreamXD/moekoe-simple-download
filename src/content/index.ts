import { m } from './utils/logger';

if(!window.LateLib) {
	$modal.alert(m('Simple Download 现在需要安装 LateLib 才能正常运作。', '请前往插件市场安装 LateLib 后刷新页面/重启应用。'));
	throw new Error(m('LateLib not found'));
}

import App from './App.vue';
import logger from './utils/logger';
import { upgrade } from './utils/upgrade_from_0.x';
import { check } from './utils/check_moekoe';
import download from './utils/download';
import { checkUpdate } from './utils/check_update';
import { createAria2, changeProtocol } from './utils/aria2.js';
import defaultOptions from './default.json';

const { createApp, reactive, shallowRef } = LateLib.useVue();
const aria2 = shallowRef<import('@baptistecdr/aria2').default | null>(null);

const checkUpdateAndNotify = async() => {
	const latestVersion = await checkUpdate(version.main);
	if(!latestVersion) { logger.log('not found new version'); return; }
	logger.log(`new version available: v${latestVersion}`);

	if(await $modal.confirm(
		m('Simple Download 有新版本可用！', `当前版本: v${version.main}\n最新版本: v${latestVersion}`, '是否前往下载？')
	)) open('https://github.com/LateDreamXD/moekoe-simple-download/releases/latest', '_blank', 'noopener');
}

const addDlBtnToCtrls = (options: SDOptionsV1) => {
	const extraControls = document.querySelector('.player-container>.player-bar>.extra-controls')!;
	const dlBtn = extraControls.querySelector('.extra-btn')!.cloneNode() as HTMLButtonElement;
	dlBtn.innerHTML = '<i class="fas fa-download"></i>';
	dlBtn.title = '通过 Simple Download 下载当前歌曲';
	dlBtn.addEventListener('click', async() => {
		const song = LateLib.getCurrentSong();
		if(!song) {
			$modal.alert(m('😵 无法获取当前歌曲'));
			return;
		}

		const filename = options.filename_format
			.replaceAll('{artist}', song.author)
			.replaceAll('{title}', song.name)
			.replaceAll('{ext}', song.url.split('.').pop() || 'mp3');

		logger.log(`start downloading song with method ${options.download_method}:`, song);

		if(options.download_method === 'aria2') {
			if(!aria2.value) aria2.value = createAria2(options.aria2_options.connection);
			await changeProtocol(aria2.value, options.aria2_options.protocol);

			if(options.aria2_options.protocol === 'ws') {
				// @ts-ignore
				aria2.value.addEventListener('onDownloadComplete', ({ detail }) => {
					logger.log('successfully download with aria2', detail);
				}, { once: true });

				// @ts-ignore
				aria2.value.addEventListener('onDownloadError', ({ detail }) => {
					logger.error('download failed, detail:', detail);
					$message.error(m('Aria2 下载失败，请检查连接配置或服务运行状态', '如果一切正常请将控制台错误信息提交反馈'));
				}, { once: true });
			}

			download.aria2(aria2.value, song.url, filename, options.aria2_options.dir);
		} else {
			download[options.download_method](song.url, filename);
		}
	});
	extraControls.insertBefore(dlBtn, extraControls.firstChild);
}

const init = async() => {
	const checkResult = check();
	if(checkResult.isMoekoeApp || checkResult.isMoekoeWeb || !isProd) {
		if(checkResult.isMoekoeApp && location.protocol === 'file:')
			if(!location.pathname.endsWith('app.asar/dist/index.html')) return;
		try {
			const root = document.createElement('div');
			document.body.appendChild(root);

			upgrade(defaultOptions as SDOptionsV1);
			const options = reactive<SDOptionsV1>(defaultOptions as SDOptionsV1);

			const refreshOptions = () => {
				Object.assign(options, JSON.parse(
					localStorage.getItem('latedream:simple_download_options') || 'null'
				) || defaultOptions);
			}

			const getLastOptions = () =>
				(JSON.parse(
					localStorage.getItem('latedream:simple_download_options') || 'null'
				) || defaultOptions) as SDOptionsV1;

			const app = createApp(App, { options, defaultOptions, refreshOptions, getLastOptions });
			refreshOptions();
			app.mount(root);

			if(isProd)
				addDlBtnToCtrls(options);
			try { if(options.check_update) checkUpdateAndNotify(); }
			catch(e: any) { logger.error('failed to check update:', e.message, e?.stack); }
		}
		catch(e: any) {logger.error('failed to inject page:', e.message, e?.stack);}
	}
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
