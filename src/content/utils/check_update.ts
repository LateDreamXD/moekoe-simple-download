export const checkUpdate = async (version: string) => {
	const res = await fetch('https://github.com/LateDreamXD/moekoe-simple-download/releases/latest',
		{ redirect: 'follow' });
	const latestVersion = res.url.split('/').pop()?.replace('v', '') || '0.0.0';
	const current = version.split('.'), latest = latestVersion.split('.');
	for(let i = 0; i < current.length; i++) {
		if(Number(current[i]) > Number(latest[i])) return false;
		if(Number(current[i]) < Number(latest[i])) return latestVersion;
	}
	return false;
}
