// /广告页
import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableWithoutFeedback,
	AsyncStorage,
} from 'react-native';
import { http } from '@services';
import {
	umengTrack,
	commonStyle,
	transformSize,
	isIphoneX
} from '@utils'
import adLogo from '@src/assets/images/ad-logo.png'
const platform = Platform.OS;


export default class Advertisement extends Component {
	static loadAds = async () => {
		let request = {
			url: '/services/app/v1/ad/list',
			params: {
				keyWord: '启动广告', count: '1'
			}
		};

		let res = await http(request);
		let adList = res.data.data || [];
		if (adList && adList.length) {
			let adInfo = adList[0];
			await Image.prefetch(adInfo.adPicture);
			let data = JSON.stringify(adInfo);
			console.log(data);
			// alert(data)
			AsyncStorage.setItem("Advertisement", data);
		} else {
			AsyncStorage.removeItem("Advertisement");
		}
	}
	/** 广告页倒计时部分**/
	constructor(props) {
		super(props);
		this.state = { time: 6, showWebView: false };
		this.timer = null;
	}

	checkTimer = () => {
		let { time } = this.state;
		time = time - 1;
		if (time < 0) {
			this.jumpHome(false);
		} else {
			this.timer = setTimeout(this.checkTimer, 1000);
			this.setState({ time });
		}
	}
	componentDidMount() {
		this.checkTimer();
		// this.reloadData();
	}
	render() {
		let imageUrl = this.props.adInfo.adPicture;

		return (
			<View style={styles.container}>
				<TouchableWithoutFeedback onPress={this.gotoUrl}><Image onLoad={this.load} source={{ uri: imageUrl }} style={styles.image} /></TouchableWithoutFeedback>
				<View style={styles.timeView}>
					<Text style={styles.text} onPress={() => {this.jumpHome(true)}}>{`跳过${this.state.time}s`}</Text>
				</View>
				<View style={styles.bottomContent}>
					<Image source={adLogo} />
				</View>
			</View>
		);
	}
	
	gotoUrl = () => {
		let { adUrl, adDisplay } = this.props.adInfo;
		// alert(url)
		this.timer && clearTimeout(this.timer);
		umengTrack('开屏广告')
		this.props.onClose({ url: adUrl, adDisplay });
	}

	jumpHome = (jump) => {
		umengTrack('开屏广告', {
			'跳过': (jump ? '是' : '否')
		});
		this.gotoHome()
	}
	gotoHome = () => { // 关闭
		let { adUrl } = this.props.adInfo;
		this.timer && clearTimeout(this.timer);

		this.props.onClose();
	}

	componentWillUnMount() {
		this.timer && clearTimeout(this.timer);
	}

	load = () => {
		// alert('加载成功')
	}
}

const styles = StyleSheet.create({
	timeView: {
		right: transformSize(30),
		width: transformSize(120),
		height: transformSize(45),
		borderRadius: transformSize(20),
		alignItems: 'center',
		justifyContent: 'center',
		top: isIphoneX() ? transformSize(74) : transformSize(50),
		backgroundColor: '#646464',
		position: 'absolute',
		zIndex: 10001
	},
	image: {
		width: '100%',
		height: '100%',
		bottom: isIphoneX() ? transformSize(273) : transformSize(200),
		flex: 1
	},
	text: {
		fontSize: commonStyle.fontSize_content_summary_28,
		color: 'white',
		zIndex: 10001,
	},
	container: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		zIndex: 10000,
		left: 0, top: 0,
		bottom:0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fafafa',
	},
	bottomContent: {
		height: transformSize(200),
		position: "absolute",
		alignItems: 'center',
		justifyContent: 'center',
		bottom: isIphoneX() ? transformSize(73) : 0,
		left: 0,
		right: 0,
	},
});
