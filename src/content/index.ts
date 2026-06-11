import { createApp, reactive } from 'vue';
import App from './App.vue';
import logger from './utils/logger';
import { upgrade } from './utils/upgrade_from_0.x';
import { check } from './utils/check_moekoe';
import { getCurrent } from './utils/get_song';
import { checkUpdate } from './utils/check_update';
import { version } from '../../package.json';
import defaultOptions from './default.json';
import hookContextmenu from './utils/hook-contextmenu.js';
import hookXhr from './utils/hook-xhr.js';
import fetchUrlMatchMap from './data/fetch-url-match-map.json';
import songItemMatchMap from './data/songitem-match-map.json';

const icon = isProd ? chrome.runtime.getURL('icon.png') : '/icon.png';
const options = reactive<SDOptionsV1>(JSON.parse(
	localStorage.getItem('latedream:simple_download_options') || 'null'
) || defaultOptions);

const checkUpdateAndNotify = async () => {
	const latestVersion = await checkUpdate(version);
	if (!latestVersion) { logger.log('not found new version'); return; }
	logger.log(`new version available: v${latestVersion}`);
	new Notification('Simple Download 有新版本', {
		icon,
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
		if (!song) {
			alert('😵 无法获取当前歌曲');
			return;
		}
		const filename = options.filename_format
			.replace('{artist}', song.author)
			.replace('{title}', song.name)
			.replace('{ext}', song.url.split('.').pop() || 'mp3');

		logger.log(`start downloading song with method ${options.download_method}:`, song);
		window.SimpleDownload.download[options.download_method](song.url, filename);
	});
	extraControls.insertBefore(dlBtn, extraControls.firstChild);
}

const init = async () => {
	if (!check()) { logger.log('not moekoe page, skip'); return; }
	try {
		const root = document.createElement('div');
		document.body.appendChild(root);

		upgrade(defaultOptions as SDOptionsV1);

		const app = createApp(App, { options, defaultOptions, version });
		app.mount(root);

		if (!isProd)
			addDlBtnToCtrls(options);
		try { if (options.check_update) checkUpdateAndNotify(); }
		catch (e: any) { logger.error('failed to check update:', e.message, e?.stack); }
	}
	catch (e: any) { logger.error('failed to inject page:', e.message, e?.stack); }
}

const initHookContextmenu = () => {
	if(options.experimental_features.hook_contextmenu) {
		const route = location.hash.slice(1) as keyof typeof fetchUrlMatchMap;
		hookXhr.init(
			fetchUrlMatchMap[route],
			t => {
				try {
					const data = JSON.parse(t);
					if(!data.data.songs && !data.data.song_list)
						throw new Error('can not found `data.songs` or `data.song_list`!');
					window.SimpleDownloadShared = window.SimpleDownloadShared || {};
					window.SimpleDownloadShared.songList = data.songs || data.data.song_list;
				} catch(e) {
					logger.error(e);
				}
			}
		);
		hookContextmenu.init(t => {
			const songItem = t.closest<HTMLDivElement>(songItemMatchMap[route]);
			if(!songItem) return logger.error('can not get song-item!');
			const songName = (() => {
				let n: undefined | string =
					songItem.querySelector('.track-title')?.getAttribute('title') ||
					songItem.querySelector('.song-title')?.textContent;
				return n;
			})();
			if(!songName) return logger.error('can not get song name!');
			window.SimpleDownloadShared.songList.forEach(song => {
				const songname = song.songname || (song.name as string).split('-')[1].trim();
				if(songName === songname) {
					const node = t.firstChild as HTMLUListElement;
					node.insertAdjacentHTML('afterend', `
						<li class="simple-download-context" title="SimpleDownlod 注入"><i class="fas fa-download"></i> 下载该歌曲</li>
					`);
					const injectNode = node.querySelector<HTMLLIElement>('.simple-download-context');
					if(injectNode) {
						injectNode.addEventListener('click', async() => {
							const url = await window.SimpleDownload.song.getByHash(song.hash);
							if(!url) return;
							
							const filename = options.filename_format
								.replace('{artist}', song.author)
								.replace('{title}', song.name)
								.replace('{ext}', url.split('.').pop() || 'mp3');
						
							window.SimpleDownload.download[options.download_method](
								url, filename
							);
						});
					}
				}
			});
		});
	}
}

if (document.readyState === 'loading') {
	if(options.experimental_features.hook_contextmenu) initHookContextmenu();
	document.addEventListener('DOMContentLoaded', init);
} else {
	logger.error('bad timing');
	init();
}
