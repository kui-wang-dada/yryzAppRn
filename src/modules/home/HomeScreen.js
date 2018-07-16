import React, { Component } from 'react';
import {
	View, Platform, Touchable, Tabs, Icon, TabView, UpdateModal, Message
} from "@components";
import {
	Dimensions,
	StyleSheet,
	Linking,
	AsyncStorage,
	NativeModules,
	DeviceEventEmitter
} from 'react-native';
import { transformSize, commonStyle, modal, isIphoneX } from '@utils'

import { getUserInterests } from '@modules/login/services/LoginPrenster';

import { http } from '@services'
import {
	signOut
} from '@modules/user/user.action';
import Interest from "./HomeInterest"
import Recommend from "./HomeRecommend"
import Video from "./HomeVideo"
import { umengTrack } from '@utils'
import { connect } from 'react-redux';
const { height, width } = Dimensions.get("window")

let mapStateToProps = (state) => {
	return {
		choosedInterests: state.transition.interest_choosed,
	};
};
@connect(mapStateToProps)
class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ViewPageCount: ["推荐", "视频", "趣文"],
		}
		this.ViewPageIndex = 0
	}

	static navigationOptions = ({ navigation, screenProps }) => ({
		header: null,
	})

	render() {
		let { ViewPageCount } = this.state
		return (
			<View style={s.homeWrap}>
				<TabView
					indicator={{ bottom: 0 }}
					tab={{ height: transformSize(80) }}
					onTabPress={this.onTabPress}
					onIndexChange={this.onIndexChange}
					style={{ flex: 1, backgroundColor: "white", elevation: 0 }}>
					<Recommend
						ref="_tab_0"
						tabLabel={ViewPageCount[0]}
						navigation={this.props.navigation}
					/>
					<Video
						ref="_tab_1"
						tabLabel={ViewPageCount[1]}
						navigation={this.props.navigation}
					/>
					<Interest
						ref="_tab_2"
						tabLabel={ViewPageCount[2]}
						navigation={this.props.navigation}
					/>

				</TabView>
			</View>
		)
	}

	componentDidMount = async () => {
		// 页面已显示
		let isFocused = this.props.navigation.isFocused();
		if (isFocused) {
			let skipTransitionPage = await AsyncStorage.getItem("skipTransitionPage");
			if (skipTransitionPage) {
				// 获取用户标签
				getUserInterests()
			}
			// 强制更新
			this.showUpdateModal()
		}
	}

	componentWillUnmount() {
		if (Platform.OS === 'android') {
			this.updateListener && this.updateListener.remove();
		}
	}


	showUpdateModal = async () => {
		let res = await http.get(`/services/app/v1/upgrade/info`)
		let response = res.data.data
		// 有新版本
		let that = this;
		if (response.upgradeFlag) {
			if (Platform.OS === "ios") {
				let component = (<UpdateModal hideModal={modal.close} forceUpdate={response.forceUpgradeFlag} updateContent={response.upgradeNotice} onUpdate={() => {
					that.update(response);
				}} />)
				modal.show(component, 'centerModal', response.forceUpgradeFlag)
			}
		}
		if (Platform.OS === 'android') {
			this.updateListener = DeviceEventEmitter.addListener("updateSubmit", ()=>{
				console.log('点击升级');
				that.update(response);
			});
		}
	}

	update(response) {
		if (response.logoutFlag) {
			this.props.dispatch(signOut());
		}
		if (response.clearCacheFlag) {
			this.clearCache()
		}
		let url = 'itms-apps://itunes.apple.com/cn/app/悠然一指/id1108712331?mt=8'
		Linking.openURL(url)
	}

	clearCache = () => {
		// 清除所有缓存
		AsyncStorage.clear()
		//	退出登录
		this.props.dispatch(signOut());
		// 清除本地缓存
		NativeModules.CacheClear.clearCache()
	}

	onIndexChange = (index) => {
		if (index === 1) {
			umengTrack('首页_视频Tab')
		} else if (index === 2) {
			umengTrack('首页_趣文Tab')
		}
		this.ViewPageIndex = index
	}
	onTabPress = ({ route }) => {
		let { ViewPageCount } = this.state
		if (ViewPageCount[this.ViewPageIndex] === route.key) {
			if (this.ViewPageIndex === 0) {
				let tabItem = this.refs[`_tab_${this.ViewPageIndex}`]._reactInternalFiber.child.stateNode
				if (tabItem.state.dataRecommend) {
					tabItem.goToTop()
					tabItem.handleRefresh()
				}
			} else {
				let tabItem = this.refs[`_tab_${this.ViewPageIndex}`]
				if (route.key === "视频") {
					if (tabItem.data) {
						tabItem.goToTop()
					}
				}
				if (route.key === "趣文") {
					if (tabItem.state.data) {
						tabItem.goToTop()
					}
				}


			}


		}
	}
}

const s = StyleSheet.create({

	homeWrap: {
		flex: 1,
		paddingTop: isIphoneX() ? transformSize(100) : Platform.OS === "ios" ? transformSize(46) : transformSize(6),
		backgroundColor: '#fff',
	},
	flatlist: {
		width: width,
	},
	tabs: {
		paddingTop: transformSize(30),
		marginTop: Platform.OS === "ios" ? transformSize(40) : 0,
	},
	separation: {
		height: transformSize(2),
		width: width,
		// elevation: 1,
		backgroundColor: "#e5e5e5"
	},
	shadow: {
		backgroundColor: '#fff',
		shadowColor: '#eeeeee',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 2,
	},
	tabFlatlist: {
		paddingLeft: transformSize(20),

		paddingRight: transformSize(20),

		height: transformSize(120),
		// marginBottom: transformSize(5)
	},
	tabItemWrap: {
		height: transformSize(54),
		marginTop: transformSize(30),
		paddingVertical: transformSize(10),
		paddingHorizontal: transformSize(16),
		marginRight: transformSize(20),

		alignItems: 'center',
		borderRadius: transformSize(27),
		justifyContent: 'center',
		backgroundColor: "#fff"
	},
	tabItem: {
		// paddingHorizontal: transformSize(16),
		// paddingVertical: transformSize(10),
		// height: transformSize(50),
		// marginLeft: transformSize(20),
		textAlign: 'center',
		// lineHeight: transformSize(50),
		color: "#8c8c8c",
		fontSize: commonStyle.fontSize_twoLevelTab_32,   // 32


	},
	tabActiveItem: {
		color: "#fff",
	},
	tabActiveItemWrap: {
		backgroundColor: commonStyle.color_theme
	},
	loadingWrap: {
		flexDirection: 'row',
		height: transformSize(94),
		alignItems: 'center',
		justifyContent: 'center',
	},
	loading: {
		fontSize: transformSize(24),
		color: "#666",
		marginLeft: transformSize(16),
		marginRight: transformSize(16)
	},

})

export default HomeScreen;
