import {

	Platform
} from 'react-native';
import { env } from '@utils';
import { Common } from 'ydk-react-native';
import axios from 'axios';
import store from '../store';
import Toast from '../components/Toast'
async function getDeviceInfo(params) {
	let deviceInfo = await Common.getDeviceInfo();
	if (deviceInfo) {
		deviceInfo.deviceType = Platform.OS === 'android' ? '2' : '1';
		return deviceInfo;
	} else {
		return {
			deviceId: "defaultId",
			appVersion: "1.0.0",
			deviceType: "2",
			ip: "",
			OS: ""
		};
	}
}

function init() {
	const http = axios.create();

	http.interceptors.request.use(async (config) => {
		Object.assign(config, {
			url: handleUrl(config.url)
		});
		let { user = {} } = store.getState();
		let device = await getDeviceInfo();
		config.headers.common["deviceId"] = device.deviceId;
		config.headers.common["appVersion"] = device.appVersion;
		config.headers.common["deviceType"] = Platform.OS == 'ios' ? 1 : 2;
		config.headers.common["OS"] = device.OS;
		config.headers.common["ip"] = device.ip;
		if (user.userId) {
			config.headers.common["userId"] = user.userId;
			config.headers.common["token"] = user.token;
		}
		if (__DEV__) {
			if (config.method.toLowerCase() === 'get') {
				console.log(`Request (${config.method}) to "${config.url}",params: ${JSON.stringify(config.params)}`);
			} else {
				console.log(`Request (${config.method}) to "${config.url}",body data: ${JSON.stringify(config.data)}`);
			}

		}

		return config;
	}, () => {
	});
	http.interceptors.response.use((res) => {
		const body = res.data;
		if (body.code !== '200') {
			if (body.msg) {
				Toast.show(body.msg);
			}
			console.log(body.msg, res.config.url);
			throw new Error(body);
		}
		return res;
	}, (error) => {
		// console.log(error)
		let { response = {}, config = {}, message } = error;
		warn([
			`${message}`,
			`URL: ${config.url}`,
			`Method: ${config.method}`,
			`Status: ${response.status}`,
			`Request headers:\n${formatJson(config.headers)}`,
			`Response headers:\n${formatJson(response.headers)}`,
			`Response data:\n${formatJson(response.data)}`,
		]);
		return Promise.reject(error);
	});
	return http;
}
function handleUrl(url) {
	if (isAbsoluteUrl(url)) {
		return url;
	}
	if (env.httpBaseUrl) {
		return `${env.httpBaseUrl}${url}`;
	}
	return `http://yryz-dev.yryz.com/yryz${url}`;
}
function isAbsoluteUrl(url) {
	return /^https?:/.test(url);
}
function warn(lines) {
	console.warn(lines.join('\n\n'));
}
function formatJson(object) {
	return JSON.stringify(object, null, 2);
}
export default init();
