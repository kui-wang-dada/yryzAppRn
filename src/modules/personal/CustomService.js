import React from 'react';
import { StyleSheet, Linking, Clipboard, Platform, PixelRatio } from 'react-native';
import {
	Text,
	ScrollView,
	View,
	Touchable,
	withUser,
	Icon,
	withNavigation,
	Toast,
	FlatList,
} from '@components';
import { YIcon } from '../../assets';
import { transformSize } from '@utils';
import {
	Share
} from 'ydk-react-native'
// import { YShareSDK, YZhugeIo } from '@ydk';
@withNavigation
export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [
				{
					icon: 'qq',
					name: 'QQ',
					sing: '2904462830',
					color: '#d9dce8'
				},
				{
					icon: 'wechat',
					name: '微信',
					sing: 'yryz77',
					color: '#d9dce8'
				},
				{
					icon: 'phone',
					name: '座机',
					sing: '400-0585-377',
					color: '#d9dce8'
				},
				{
					icon: 'email',
					name: '邮箱',
					sing: 'service@yryz.com',
					color: '#d9dce8'
				},
			]
		};
	}

	componentDidMount() {

	}



	render() {
		return (
			<View style={styles.contMain}>
				{
					this.state.data.map((item, index) => {
						return this.renderItem(item, index)
					})
				}
			</View>
		);
	}


	renderItem = (item, index) => {
		let line = index < this.state.data.length - 1 ? styles.line : null;
		return (
			<Touchable onPress={() => this.do(item)} key={index}>
				<View style={styles.container}>
					<View style={[styles.mainList, line]}>
						<View style={styles.mainLeft}>
							<Icon style={{ fontSize: transformSize(36), paddingRight: transformSize(20), color: item.color }} name={item.icon} />
							<Text style={styles.text}>{item.name}</Text>
						</View>
						<Text style={styles.textright}>{item.sing}</Text>
					</View>
				</View>
			</Touchable>
		);
	}




	_setClipboardContent = async (item) => {
		Clipboard.setString(item.sing);
		try {
			let content = await Clipboard.getString();
			if (item.icon === 'email') {
				Toast.show('复制成功，小悠随时等候您的邮件~');
				return;
			}
			if (item.icon === 'wechat') {
				Toast.show('复制成功，小悠随时在微信等您~');
				return;
			}
		} catch (e) {
			Toast.show('复制异常');
		}
	};



	async do(item) {
		if (item.name === '座机') {
			let url = 'tel:4000585377';
			Linking.canOpenURL(url).then(supported => {
				if (!supported) {
					console.log('Can\'t handle url: ' + url);
				} else {
					return Linking.openURL(url);
				}
			}).catch(() => { Toast.show({ text: '您已取消呼叫小悠~' }); });
		} else if (item.name === 'QQ') {
			let apps = await Share.getInstallPlatforms();
			if (apps.indexOf('qq') > -1) {
				let url = Platform.select({
					'ios': "mqq://im/chat?chat_type=wpa&uin=2904462830&version=1&src_type=web",
					'android': "mqqwpa://im/chat?chat_type=wpa&uin=2904462830"
				});
				Linking.canOpenURL(url).then(supported => {
					console.log(supported);
					if (!supported) {
						console.log('Can\'t handle url: ' + url);
					} else {
						return Linking.openURL(url);
					}
				}).catch(() => Toast.show('您已取消联系小悠~'));

			} else {
				Toast.show('您还没有安装QQ~');
			}
		} else {
			this._setClipboardContent(item);
		}

	}


	static navigationOptions = {
		headerTitle: '联系客服',
		headerTitleStyle: { flex: 1, textAlign: 'center', fontWeight: '0' },
		headerRight: <View />
	};
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: transformSize(40),
		backgroundColor: 'white'
	},
	contMain: {
		flex: 1,
		backgroundColor: '#f4f4f4'
	},
	touchable: {
		width: '100%',
	},
	mainList: {
		flexDirection: 'row',
		height: transformSize(108),
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#fff'
	},
	mainLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'center',
	},
	line: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#eee',
	},
	yicon: {
		paddingRight: transformSize(30)
	},
	text: {
		fontSize: transformSize(32),
		color: 'black'
	},
	textright: {
		fontSize: transformSize(30),
		color: '#666',
		marginRight: transformSize(20),
	}
});