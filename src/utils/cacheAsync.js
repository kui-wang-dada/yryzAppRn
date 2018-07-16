import { http } from '../services';
import qs from 'qs';
import { AsyncStorage } from 'react-native';
export default async (req) => {
	return new Promise(async (resolve, reject) => {
		if (typeof req === "string") {
			req = { url: req };
		}
		let { url, params = {} } = req;
		let key = url + "?" + qs.stringify(params);
		let data = await AsyncStorage.getItem(key);
		http(req).then(async (res) => {
			try {
				await AsyncStorage.setItem(key, JSON.stringify(res));
				if (!data) {
					resolve(res)
				}
			}
			catch (ex) {
				let keys = await AsyncStorage.getAllKeys();
				console.error(ex);
				console.log('cache keys', keys);
				console.log(JSON.stringify(res))

			}
		})
		if (data) {
			resolve(JSON.parse(data))
		}

	})


}