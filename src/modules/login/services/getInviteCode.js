import {
	Clipboard
} from 'react-native';

async function getInviteCode() {
	const text = await Clipboard.getString();
	return getFromText(text);
}

function getFromText(text) {
	const matched = text.match(/YRYZ\d{8}/);
	return matched ? matched[0] : '';
}

export default getInviteCode;