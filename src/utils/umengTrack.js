import { Track, Common } from 'ydk-react-native'
import store from '../store';

export default function umengTrack(eventName, params) {
	eventName = `5_0${eventName}`
	Common.getDeviceInfo().then((deviceInfo) => {
		let eventData = Object.assign({
			'手机号': store.getState().user.custPhone,
			'设备号': deviceInfo.deviceId,
		}, params)
		Track.setEvent(eventName, eventData);
	}).catch((e) => {
		Track.setEvent(eventName, {});
	});
};

