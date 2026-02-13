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

export {downlodFile, fetchDownload};
export default {direct: downlodFile, fetch: fetchDownload};
