import {
	NetInfo,
	Platform,
} from 'react-native';
import {
	Toast
} from '@components';

async function init() {
	NetInfo.isConnected.addEventListener('connectionChange', handleConnectedChange);

	// React Native's bug — always returns `false` on iOS.
	if (Platform.OS === 'android') {
		const connected =  await NetInfo.isConnected.fetch();
		handleConnectedChange(connected);
	}
}

function handleConnectedChange(connected) {
	if (connected) {
		return;
	}

	Toast({
		text: '没网还想看？！'
	});
}

export default {
	init
};