export default (headers?: Record<string, string>) => {
	const MoeData = localStorage.getItem('MoeData');
	let moedata: any;
	if(MoeData) {
		moedata = JSON.parse(MoeData);
		if(!moedata.UserInfo || !moedata.UserInfo.token || !moedata.UserInfo.userid) {
			alert('😵 要使用 Fetch API 下载方式，请先登录');
			throw new Error('MoeData missing necessary fields');
		}
	} else { alert('😵 要使用 Fetch API 下载方式，请先登录'); throw new Error('MoeData not found, maybe is not logged in'); }
	const data = headers || {};
	data.Authorization = `token=${encodeURIComponent(moedata.UserInfo?.token)};userid=${encodeURIComponent(moedata.UserInfo?.userid)}`;
	return data;
}
