const OriginalTitle = document.title;

export const check = () => {
	const isMoekoeApp = navigator.userAgent?.includes('moekoemusic');
	const isMoekoeSite = location.host === 'music.moekoe.cn' && location.pathname === '/share/';
	const isMoekoeWeb = OriginalTitle === 'MoeKoe 萌音';
	return {
		isMoekoeApp,
		isMoekoeSite,
		isMoekoeWeb
	}
}
