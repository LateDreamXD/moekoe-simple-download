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

// 此处参考了 https://github.com/hmjz100/LinkSwift/blob/8946be2/%EF%BC%88%E6%94%B9%EF%BC%89%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js#L878-L938
const idmDownload = async(url: string, filename: string, filesize: number, clientid?: number) => {
	const headers = `Authorization: ${auth().Authorization}\n`;
	const seq: number = LateLib.getLocalStorage('latedream:simple_download_idm_seq') || 1;
	const idmUrl = `http://127.0.0.1:1001/client/${clientid || 1}?seq=${seq}`;
	const time = Date.now();

	const format = (key: number, val: any) => {
		if(!val) return '';
		const strVal = String(val);
		const size = new Blob([strVal]).size;
		return `${key}=${size}:${strVal}`;
	}

	const fields = [
		format(4, filename.split('.').pop()), // 4: 文件类型
		format(6, url), // 6: 链接
		format(7, location.origin), // 7: 来源页面（“该文件来自网页”）
		format(11, headers), // 11: 请求头
		format(100, filename), // 100: 文件名
		format(122, 4), // 122: 代理
	];

	const data = `MSG#${seq}#13#1#10241:${seq + 1000}:0:${time}:0:1:2:${filesize}:0,${fields.join(",")};`;

	const res = await (await fetch(idmUrl, {
		method: 'POST',
		body: data
	})).text();

	if(res && res.endsWith(`${seq}:3;`)) {
		LateLib.setLocalStorage('latedream:simple_download_idm_seq', seq + 1);
		return true;
	} else return false;
}

export {downlodFile, fetchDownload, aria2Download, idmDownload};
export default {direct: downlodFile, fetch: fetchDownload, aria2: aria2Download, idm: idmDownload};
