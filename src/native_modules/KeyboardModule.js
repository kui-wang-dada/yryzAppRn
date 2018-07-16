import {
	NativeModules
} from 'react-native';
const defaultCommon = {
}
let { KeyboardModule = defaultCommon } = NativeModules;

export default KeyboardModule;