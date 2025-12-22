import logger from './libs/logger';

const getSongInfo = (): {
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

const injectPage = (target?: Element | string) => {
	!target && (target = document.querySelector('.player-container>.player-bar>.extra-controls')!);
	typeof target === 'string' && (target = document.querySelector(target)!);
	if(!target) throw new Error('target not found');
	const button = target.querySelector('.extra-btn')!.cloneNode(true) as HTMLButtonElement;
	button.style.backgroundColor = 'inherit';
	button.title = '使用简单下载插件进行下载';
	// <i class="fas">str</i>
	button.children[0].classList.add('fa-download');
	button.children[0].textContent = '';
	button.addEventListener('click', () => {
		const info = getSongInfo();
		if(info) {
			const song = `${info.name} - ${info.author}`;
			const a = document.createElement('a');
			a.href = info.url;
			a.download = `${song}.${info.url.split('.').pop()}`;
			a.click();
			logger.log('start downloading:', song);
		} else alert('😵 未能获取到当前歌曲的下载地址');
	});

	target.insertAdjacentElement('beforebegin', button);
}

const init = () => {
	try {injectPage();}
	catch(e: any) {logger.error('failed to inject page:', e.message, e?.stack);}
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
