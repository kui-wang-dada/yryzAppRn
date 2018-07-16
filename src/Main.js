import React, { Component } from 'react';
import { Common } from 'ydk-react-native';
import { http } from './services';
import { env, umengTrack } from '@utils';
import App from './App';
import { StoreProvider } from './store';
import {
	AsyncStorage,
	Alert,
	Modal,
	Clipboard,
	Linking,
	UIManager,
	LayoutAnimation,
	NativeModules,
	View,
	StyleSheet,
	Platform
} from 'react-native';
import ChooseInterest from './modules/transition/ChooseInterest';
import TransitionPage from './modules/transition/TransitionPage';
import JPush from './modules/personal/message/JPush';
import Advertisement from './modules/transition/Advertisement';
import { navigation } from '@services';
import store from './store';

if (!__DEV__) {
	global.console = {
		info: () => { },
		log: () => { },
		warn: () => { },
		debug: () => { },
		error: () => { },
	};
}

const version = 4.5
export default class Main extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		skipInterestingLabel: false,
		skipTransitionPage: true,
		adInfo: {},
		skipAds: true,
		isReady: false,
		interestList: [],
		device: {},
	}

	render() {
		let { isReady } = this.state;
		return (
			<View style={{ flex: 1 }}>
				<StoreProvider>{this.renderRoot()}</StoreProvider>
				{this.renderAdvertisement()}
				{this.renderTransitionPage()}
			</View>
		);
	}
	componentDidMount() {
		this.init();
	}

	async getDeviceInfo() {
		let device = await Common.getDeviceInfo();
		this.setState({ device }, () => {
			if (!device.deviceId) {
				store.dispatch({ type: 'SKIP_INTEREST' });
			}
		});
	}

	async getInterestsTag() {
		let flag = await http.get(`/services/app/v3/user/label/launch/flag`).data;
		this.setState({
			flag: flag
		})
	}

	async init() {

		let skipAds = true;
		let adInfo = {};
		let skipInterestingLabel = false;
		let { skipTransitionPage } = this.state;

		//获取是否开启选择标签的标识
		try {
			let response = await http.get(`/services/app/v3/user/label/launch/flag`);
			this.setState({ flag: parseInt(response.data.data) })
		} catch(error) {
			console.log(error)
		}

		try {
			skipTransitionPage = await AsyncStorage.getItem(`skipTransitionPage${version}`);
			if (!skipTransitionPage) {
				skipTransitionPage = Platform.OS === 'android' && Platform.Version < 20 ? true : false;
				// skipTransitionPage = !skipTransitionPage
			}
			//关闭选择标签页面
			if (this.state.flag === 1) {
				AsyncStorage.setItem(`skipInterestingLabel${version}`, '1');
				skipInterestingLabel = true;
			} else {
				skipInterestingLabel = await AsyncStorage.getItem(`skipInterestingLabel${version}`);
				if (!skipInterestingLabel) {
					AsyncStorage.setItem(`skipInterestingLabel${version}`, '1');
				}
			}

			if (env.alwaysShowTransitionPage) {
				skipTransitionPage = false;
			}

			adInfo = await AsyncStorage.getItem('Advertisement');
			adInfo = (adInfo && JSON.parse(adInfo)) || {};
			this.getDeviceInfo();
			skipAds = !adInfo.adPicture;
		} catch (ex) {
			console.error(ex);
		} finally {
			this.setState({ skipTransitionPage, adInfo, skipAds, isReady: true, skipInterestingLabel }, () => {
				if (Platform.OS === 'android') {
					NativeModules.SplashScreen.closeLoadingPage();
				}
				Advertisement.loadAds();
			});
		}
	}

	async loadAssets() {
		if (!Common) {
			await Expo.Font.loadAsync({
				'iconfont': require('./assets/fonts/iconfont.ttf'),
				// Roboto: require("native-base/Fonts/Roboto.ttf"),
				// Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
				Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")

			});
		}
	}

	renderInterestingLabel() {
		let { device } = this.state;
		// 非初次显示 且 已保存感兴趣分类 或 没有找到deviceId
		if (this.state.skipInterestingLabel || !device.deviceId || this.state.interestList.length > 0) {
			return null;
		}
		return (
			<View style={style.skipWrap}>
				<ChooseInterest onPressPass={this.onPressPass} onPressSubmit={this.onPressSubmit} />
			</View>
		);
	}

	onPressPass = () => {
		Alert.alert(
			'', '确认不选择标签',
			[
				{ text: '取消', onPress: () => console.log('取消'), style: 'cancel' },
				{
					text: '确定', onPress: () => {
						umengTrack('选择个人标签', { '跳过': '' })
						this.setState({ skipInterestingLabel: true }, () => {
							store.dispatch({ type: 'SKIP_INTEREST' });
						});
					}
				},
			]
		)
	}

	onPressSubmit = () => {
		this.setState({ skipInterestingLabel: true });
	}

	renderTransitionPage() {
		if (this.state.skipTransitionPage)
			return null;
		return (
			<View style={style.skipWrap}>
				<TransitionPage onPress={this.gotoRoot} />
			</View>
		);
	}

	renderAdvertisement() {
		if (this.state.skipAds || !this.state.skipTransitionPage)
			return null;
		return (
			<Modal onRequestClose={() => false}
				visible={this.state.modalVisible}>
				<Advertisement adInfo={this.state.adInfo} onClose={this.closeAds} />
			</Modal>
		);
	}

	closeAds = async (route) => {
		this.setState({ skipAds: true }, () => {
			if (!route || !route.url)
				return;
			if (route.adDisplay === 1 || route.url.indexOf('yryzapp') > -1) {
				Linking.openURL(route.url);
				return;
			}
			navigation.navigate('WebViewScreen', route);

		});
	}


	// gotoRoot = async () => {
	// 	let contentUrl = await Clipboard.getString();		// 获取剪切板内容
	// 	const scheme = 'yryzapp://open/';
	// 	if (contentUrl && contentUrl.indexOf('yryzapp://') === 0) {  // 当剪切板有内容时  清空剪切板内容
	// 		Linking.openURL(contentUrl);
	// 		Clipboard.setString('');
	// 	}
	// }

	gotoRoot = async () => {
		let { skipTransitionPage } = this.state;
		AsyncStorage.setItem(`skipTransitionPage${version}`, "1");
		this.setState({ skipTransitionPage: "1" }, async () => {
			// 非初次安装则直接跳过
			if (skipTransitionPage)
				return;
			let contentUrl = await Clipboard.getString();		// 获取剪切板内容
			console.log('Clipboard', contentUrl);
			const scheme = 'yryzapp://open/';
			if (contentUrl && contentUrl.indexOf('yryzapp://') === 0) {  // 当剪切板有内容时  清空剪切板内容
				console.log('Clipboard', contentUrl);
				Linking.openURL(contentUrl);
				Clipboard.setString('');
			}
		});
	}

	renderRoot = () => {
		if (!this.state.isReady)
			return <View />;
		return (
			<View style={{ flex: 1 }}>
				<App />
				{this.renderInterestingLabel()}
				<JPush />
			</View>
		);
	}
}

const style = StyleSheet.create({
	skipWrap: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#fff',
	}
})
