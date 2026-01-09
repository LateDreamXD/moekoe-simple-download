import logger from './logger';
import getSongInfo from './get-song';
import Options from './options';
import download from './download';

const options = new Options();

const injectMenu = () => {
	const root = document.createElement('div');
	root.style.cssText = `
		display: none;
		position: fixed;
		z-index: 1000;
	`;
	const menu = root.attachShadow({mode: 'open'});
	const style = document.createElement('style');
	style.textContent = `
		.simple-download-menu {
			color: #fff;
			background-color: #000;
			border: 1px solid #233;
			border-radius: 8px;
			padding: 8px 0;
			box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
			list-style-type: none;
			margin: 0;
			padding: 0;
			li {
				padding: 8px 16px;
			}
			li::before {
				content: '';
				margin-right: 1rem;
			}
			li[data-active]::before {
				color: #ff0;
				content: '✓';
				margin-right: 8px;
			}
			small {
				display: block;
				color: #789;
			}
		}
	`;
	menu.appendChild(style);
	const list = document.createElement('ul');
	list.classList.add('simple-download-menu');
	menu.appendChild(list);

	const option1 = document.createElement('li');
	option1.textContent = '通过 Fetch API 下载';
	list.appendChild(option1);
	const option1_desc = document.createElement('small');
	option1_desc.textContent = '此方法保存歌曲时能自动命名文件，但是占用较多内存';
	option1.appendChild(option1_desc);
	option1.addEventListener('click', () => {
		option1.toggleAttribute('data-active');
		option2.toggleAttribute('data-active');

		if(option1.hasAttribute('data-active')) options.set({download: 'fetch'});
	});

	const option2 = document.createElement('li');
	option2.textContent = '直接下载';
	list.appendChild(option2);
	const option2_desc = document.createElement('small');
	option2_desc.textContent = '如果你的设备配置较高，建议使用 Fetch API 下载';
	option2.appendChild(option2_desc);
	option2.addEventListener('click', () => {
		option2.toggleAttribute('data-active');
		option1.toggleAttribute('data-active');

		if(option2.hasAttribute('data-active')) options.set({download: 'direct'});
	});

	options.option.download === 'fetch'?
	option1.toggleAttribute('data-active'):
	option2.toggleAttribute('data-active');

	document.body.appendChild(root);
	return root;
}

const injectBtn = (menuRoot: HTMLElement, target?: Element | string) => {
	!target && (target = document.querySelector('.player-container>.player-bar>.extra-controls')!);
	typeof target === 'string' && (target = document.querySelector(target)!);
	if(!target) throw new Error('target not found');
	const button = target.querySelector('.extra-btn')!.cloneNode(true) as HTMLButtonElement;
	button.style.backgroundColor = 'inherit';
	button.title = '使用简单下载插件进行下载';
	// children[0] === <i class="fas">词</i>
	button.children[0].classList.add('fa-download');
	button.children[0].textContent = '';
	button.addEventListener('click', () => {
		const info = getSongInfo();
		if(info) {
			const song = `${info.author} - ${info.name}`;
			options.option.download === 'fetch'?
			download.fetchDownload(info.url, `${song}.${info.url.split('.').pop()}`):
			download.downlodFile(info.url, `${song}.${info.url.split('.').pop()}`);
			logger.log('start downloading:', song);
		} else alert('😵 未能获取到当前歌曲的下载地址');
	});
	button.addEventListener('contextmenu', e => {
		e.preventDefault();
		menuRoot.style.left = `${e.clientX}px`;
		menuRoot.style.bottom = '8px';
		menuRoot.style.display = menuRoot.style.display === 'block'? 'none': 'block';
	});
	document.addEventListener('click', () => {
		menuRoot.style.display = 'none';
	});

	target.insertAdjacentElement('beforebegin', button);
}

export {injectBtn, injectMenu};
export default {injectBtn, injectMenu};
