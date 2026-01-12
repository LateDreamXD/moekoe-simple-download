export default () => {
	const settings = JSON.parse(localStorage.getItem('settings') || '{}');
	const data: any = {};

	const MoeData = localStorage.getItem('MoeData');
	let isAuthenticated = false;
	let moedata: any;
	if(MoeData) {
		moedata = JSON.parse(MoeData);
		isAuthenticated = !!moedata.UserInfo;
	}

	// 根据用户设置确定请求参数
	const MoeAuth = {isAuthenticated};
	if (!MoeAuth.isAuthenticated) data.free_part = 1;
	if (MoeAuth.isAuthenticated && settings?.quality === 'lossless' && settings?.qualityCompatibility === 'off') data.quality = 'flac';
	if (MoeAuth.isAuthenticated && settings?.quality === 'hires' && settings?.qualityCompatibility === 'off') data.quality = 'high';


	data.Authorization = `token=${encodeURIComponent(moedata.UserInfo?.token)};userid=${encodeURIComponent(moedata.UserInfo?.userid)}`;
	return data;
}
