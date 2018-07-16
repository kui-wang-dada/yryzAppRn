'use strict';
import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	Image,
	ImageBackground,
	Button,
	StyleSheet,
	SectionList,
	TouchableOpacity,
	Alert,
	NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import { transformSize, commonStyle, env } from '@utils'
import { Common } from 'ydk-react-native'
import { signIn, signOut } from '@modules/user/user.action';
import { Toast, Icon } from '@components'
import { StackActions, NavigationActions } from 'react-navigation';

let mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};
@connect(mapStateToProps)
export default class SettingScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			cacheText: '0 M',
			version: '',
			enviroment: env.env,
		}
	}

	componentDidMount() {

		Common.getDeviceInfo().then((res) => {
			this.setState({
				version: res.appVersion
			})
		});

		NativeModules.CacheClear.getCacheSize().then((cacheInfo) => {
			if (cacheInfo.cacheSize > 0) {
				let cachebytes = this.bytesToSize(JSON.stringify(cacheInfo.cacheSize));
				if (cachebytes) {
					this.setState({
						cacheText: cachebytes
					});
				}
			}
		});
	}

	static navigationOptions = {
		headerTitle: "设置",
		headerStyle:{
			borderBottomWidth: StyleSheet.hairlineWidth,
			elevation: 0,
			borderBottomColor: '#e5e5e5',
			backgroundColor: '#fff',
		},
	};

	render() {


		let rows = [
			{ title: '清除缓存', iconName: "clean", iconColor: '#ffaf97', rightContent: this.state.cacheText, route: '' },
			{ title: '当前版本', iconName: "version", iconColor: '#fecd06', rightContent: this.state.version }];
		if (this.props.user.isSignIn) {
			let removecache = { title: '修改密码', iconName: "password", iconColor: '#fcb576', route: "ChangePasswordScreen" };
			rows = [removecache, ...rows];
		}
		if (__DEV__) {
			let enviroment = { title: '当前环境', iconName: "environment", iconColor: '#dcabff', rightContent: this.state.enviroment };
			rows.push(enviroment);
		}
		var sections = [{ key: "", data: rows }];
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<SectionList
					style={styles.scrollView}
					renderSectionFooter={this._sectionComp}
					renderItem={this._renderItem}
					sections={sections}
					keyExtractor={(item, index) => index.toString()}
					ItemSeparatorComponent={this._renderSeparator}
					ListFooterComponent={this._renderFooter}
				/>
			</SafeAreaView>
		);
	}

	_renderItem = ({ item, index }) => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => this.itemClick(item, index)}
			>
				<View style={styles.mainContainer}>
					<View style={styles.horizonalContainer}>
						<Icon style={[{ color: item.iconColor }, styles.leftIcon]} size={transformSize(28)} name={item.iconName} />
						<Text style={styles.leftText}>
							{item.title}
						</Text>
						{
							item.rightContent
								? <Text style={styles.rigthText}>{item.rightContent}</Text>
								: <Icon style={styles.rightArrow} size={transformSize(34)} name={'arrow-right'} />
						}
					</View>

				</View>
			</TouchableOpacity>
		);
	}

	_sectionComp = (info) => {
		var txt = info.section.key;
		return <Text style={styles.sectionStyle}>{txt}</Text>
	}

	_renderFooter = () => {

		if (!this.props.user.isSignIn) {
			return (null)
		} else {
			return (
				<TouchableOpacity activeOpacity={0.5} onPress={this.footerAction}>
					<View style={styles.footerContent}>
						<Text style={styles.footerText}>退出登录</Text>
					</View>
				</TouchableOpacity>
			);
		}
	}

	_renderSeparator = () => {
		return (
			<View style={styles.line} />
		);
	}

	itemClick = (item, index) => {
		if (item.title === "清除缓存") {
			this.cleanCache();
		} else if (item.route) {
			this.props.navigation.navigate(item.route);
		}
	}

	//退出登录
	footerAction = async () => {
		//退出登录
		this.props.dispatch(signOut());

		Toast.show("退出成功");
		//重置navigate栈，返回至home页
		let resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'App' })],
		});
		this.props.navigation.dispatch(resetAction);
	}

	//清除缓存
	cleanCache() {
		let FlagText = '确定要清除缓存吗？';
		Alert.alert(
			'',
			FlagText,
			[
				{ text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: '确定', onPress: async () => {
						NativeModules.CacheClear.clearCache().then(() => {
							this.setState({
								cacheText: "0 M"
							});
							Toast.show("清除成功")
						});
					}
				},
			],
			{ cancelable: false }
		);
	}

	bytesToSize(bytes) {
		if (bytes === 0) return '0 B';
		var k = 1024;
		let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		let i = Math.floor(Math.log(bytes) / Math.log(k));
		return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
		// toPrecision(3) 后面保留一位小数，如1.0GB
	}
}

const styles = StyleSheet.create({

	scrollView: {
		backgroundColor: commonStyle.color_background,
		flex: 1,
	},
	bottomLine: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#E7E7E7',
		marginLeft: transformSize(22),
		marginRight: transformSize(22),
	},
	infoBackGround: {
		height: transformSize(70),
		backgroundColor: '#FFF4F4',
		borderRadius: transformSize(10),
		margin: transformSize(30),
		justifyContent: 'center'
	},
	line: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#dddddd',
		marginHorizontal: transformSize(35)
	},
	mainContainer: {
		flexDirection: 'column',  //子元素垂直排列，默认是垂直排列的
	},
	horizonalContainer: {
		flexDirection: 'row',
		backgroundColor: 'white',
		height: transformSize(110),
		alignItems: 'center'
	},
	leftIcon: {
		marginLeft: transformSize(40),
	},
	leftText: {
		flex: 1,
		marginLeft: transformSize(20),
		textAlign: 'left',
		fontSize: commonStyle.fontSize_twoLevelTab_32,
		color: 'black',
	},
	rigthText: {
		marginRight: transformSize(30),
		color: commonStyle.fontColor_assist_content,
		fontSize: commonStyle.fontSize_login_30,
	},
	footerContent: {
		justifyContent: 'center',
		alignItems: 'center',
		height: transformSize(110),
		backgroundColor: 'white'
	},
	footerText: {
		color: commonStyle.fontColor_assist_1,
		fontSize: commonStyle.fontSize_content_detail_34,
	},
	rightArrow: {
		marginRight: transformSize(30),
	},
	sectionStyle: {
		height: transformSize(20),
		textAlign: 'center',
		textAlignVertical: 'center',
		backgroundColor: commonStyle.color_background,
		color: 'white'
	},
});
