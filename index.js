import { AppRegistry } from 'react-native';
import App from './App';
// import App from './test/lottie'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('yryz_app', () => App);

