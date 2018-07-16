// 网络请求的缓存，每当有网络请求时，会根据URL地址为key来缓存一份数据，
// 请求数据是先拿到缓存数据，在请求，当网络请求成功后，在给请求数据，
// 所以这里会有一个问题：一次请求会拿到两次数据


import { http } from '../services';
import qs from 'qs';
import { AsyncStorage } from 'react-native';
export default async function cache(req, cb) {

	if (typeof req === "string") {
		req = { url: req };
	}
	let { url, params = {} } = req;
	let key = url + "?" + qs.stringify(params);

	let data = await AsyncStorage.getItem(key);
	if (data) {
		try {
			cb(JSON.parse(data), 'fromcache');
		} catch (ex) {
			console.warn(ex);
		}
	}
	let res = await http(req);
	try {
		await AsyncStorage.setItem(key, JSON.stringify(res));
	}
	catch (ex) {
		let keys = await AsyncStorage.getAllKeys();
		console.error(ex);
		console.log('cache keys', keys);
		console.log(JSON.stringify(res))

	}

	cb(res, 'fromhttp');
}