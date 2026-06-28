import auth from './auth';

const downlodFile = (url: string, filename?: string) => {
	const a = document.createElement('a');
	a.href = url;
	a.download = filename || url.split('/').pop() || 'download';
	a.click();
}

const fetchDownload = async(url: string, filename?: string) => {
	const res = await fetch(url, {
		headers: auth()
	});
	const blob = await res.blob();
	const urlObject = URL.createObjectURL(blob);
	downlodFile(urlObject, filename);
	URL.revokeObjectURL(urlObject);
}

const aria2Download = async(
	aria2: import('@baptistecdr/aria2').default,
	url: string, filename?: string, dir?: string
) => {
	const header = [`Authorization: ${auth().Authorization}`];
	await aria2.call('addUri', [url], {
		dir,
		header,
		out: filename
	});
}

export {downlodFile, fetchDownload, aria2Download};
export default {direct: downlodFile, fetch: fetchDownload, aria2: aria2Download};
