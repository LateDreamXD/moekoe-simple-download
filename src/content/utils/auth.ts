import { m } from './logger';

export default () => {
	const moedata = LateLib.getMoeData();
	if(!moedata || !moedata.UserInfo || !moedata.UserInfo.token || !moedata.UserInfo.userid) {
		$modal.alert(m('😵 要使用直接下载以外的下载方式，请先登录'));
		throw new Error(m('MoeData missing necessary fields'));
	}
	const data: Record<string, string> = {};
	data.Authorization = `token=${encodeURIComponent(moedata.UserInfo.token)};userid=${encodeURIComponent(moedata.UserInfo.userid)}`;
	return data;
}
