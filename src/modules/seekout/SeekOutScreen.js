import React, { Component } from 'react'
import {
	ScrollView, View, StyleSheet, Text, FlatList, Platform,
	Dimensions, ViewPagerAndroid, Animated, TouchableOpacity, NetInfo
} from 'react-native'
import { Touchable, Image, Message } from '@components'
import { transformSize, cache } from '@utils'
import { http } from '@services'
import mockData from './mockData/SeekOut'
import { umengTrack } from '@utils'
import { apiSeekList } from './api'
import {
	TabView,
	PagerPan,
	type Route,
	type NavigationState,
} from 'react-native-tab-view';
type State = NavigationState<
	Route<{
		key: string,
	}>
	>;
const { height, width } = Dimensions.get("window")

const initialLayout = {
	height: 0,
	width: Dimensions.get('window').width,
};
export default class HomeHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			data: [],
			routes: []
		}
		this.Params = {
			pageNo: 1,
			pageSize: 10
		}
		this.total
		this.noMoreData = false
		this.lastTimeLength = 0

	}
	static navigationOptions = (navigation) => ({
		headerLeft: <View style={{ width: transformSize(30) }}></View>,
		title: "找到",
		headerTitleStyle: {
			flex: 1,
			textAlign: 'center',
			fontSize: transformSize(36)
		},

	})
	render = () => {

		let { index, data, routes } = this.state

		if (routes.length) {
			return (
				<TabView
					style={s.container}
					navigationState={this.state}
					renderTabBar={this._renderTabBar}
					renderPager={this._renderPager}
					renderScene={this._renderScene}
					onIndexChange={this._handleIndexChange}
					initialLayout={initialLayout}
					useNativeDriver
				/>
			)
		} else {
			return (
				<View style={{ flex: 1, backgroundColor: "#fff" }}>
					<Message preset="no-data"></Message>
				</View>
			)

		}

	}
	componentDidMount = () => {
		this.getSeekList()
		NetInfo.addEventListener(
			'connectionChange',
			this.getSeekList
		);
	}

	componentWillUnmount() {
		NetInfo.removeEventListener(
			'connectionChange',
			this.getSeekList
		);

	}

	_renderTabBar = () => null;

	_renderScene = props => {
		let { data } = this.state
		return (

			<Animated.View style={[s.itemWrap, this._buildCoverFlowStyle(props)]}>
				<Touchable type="withoutFeedback" onPress={() => { this.goToDetail(data[props.route.key]) }}>
					<View>
						<View style={s.imgWrap}>
							<Image source={{ uri: data[props.route.key].mainBannerImg }} style={s.itemImg} />
						</View>
						<Text style={s.itemTitle} numberOfLines={1}>{data[props.route.key].configTitle}</Text>
						<Text style={s.itemSummary} numberOfLines={3}>{data[props.route.key].coverProfileDesc}</Text>
					</View>

				</Touchable>

			</Animated.View>


		)

	}

	_renderPager = props => <PagerPan {...props} />;

	_handleIndexChange = index => {
		this.setState({
			index
		})
		if (index === this.total - 1) {
			if (this.noMoreData) {
				this.Params.pageNo -= 1
			}
			this.getArticleList()
		}
	};
	_buildCoverFlowStyle = ({ layout, position, route, navigationState }) => {

		const { width } = layout;
		const { routes } = navigationState;
		const currentIndex = routes.indexOf(route);
		const inputRange = routes.map((x, i) => i);
		const translateOutputRange = inputRange.map(i => {
			return (width / 3) * (currentIndex - i) * -1;
		});
		const scaleOutputRange = inputRange.map(i => {
			if (currentIndex === i) {
				return 1;
			} else {
				return 0.8;
			}
		});
		const opacityOutputRange = inputRange.map(i => {
			if (currentIndex === i) {
				return 1;
			} else {
				return 0.3;
			}
		});

		const translateX = position.interpolate({
			inputRange,
			outputRange: translateOutputRange,
			extrapolate: 'clamp',
		});
		const scale = position.interpolate({
			inputRange,
			outputRange: scaleOutputRange,
			extrapolate: 'clamp',
		});
		const opacity = position.interpolate({
			inputRange,
			outputRange: opacityOutputRange,
			extrapolate: 'clamp',
		});

		return {
			transform: [{ translateX }, { scale }],
			// opacity,
		};
	};
	// 跳转相关
	goToDetail = (item) => {
		let { configType, kid } = item
		let goToPage
		switch (configType) {
			case 1:
				goToPage = "SeekOutDeatilSequence"
				break;
			case 2:
				goToPage = "SeekOutDeatilPK"
				break;
			case 3:
				goToPage = "Combination"
				break
			default:
				goToPage = "Combination"
				break
		}

		this.props.navigation.navigate(goToPage, { id: kid, type: 1 })
		umengTrack('找到详情', { '来源': '找到' })
	}

	// 数据相关
	getSeekList = () => {
		let { pageNo, pageSize } = this.Params
		let url = `${apiSeekList}/${pageNo}/${pageSize}`
		cache(url, res => {
			let data = res.data.data

			this.total = data.entities.length
			this.setState({ data: data.entities, routes: Object.keys(data.entities).map(key => ({ key })) })
		});
	}
	getArticleList = async () => {

		this.Params.pageNo += 1
		let { pageNo, pageSize } = this.Params
		let url = `${apiSeekList}/${pageNo}/${pageSize}`
		let dataNew = (await http(url)).data.data.entities
		if (dataNew) {
			if (dataNew.length < pageSize || !dataNew.length) {
				let time = this.lastTimeLength
				this.lastTimeLength = dataNew.length
				if (this.lastTimeLength) {
					dataNew = dataNew.slice(0, dataNew.length - time)
				}
				this.noMoreData = true
			}
			let { data } = this.state
			dataNew = [].concat(data, dataNew)
			this.total = dataNew.length
			this.setState({ data: dataNew, routes: Object.keys(dataNew).map(key => ({ key })) })
		}


	}

}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	itemWrap: {
		marginHorizontal: -transformSize(50),
		// paddingHorizontal: transformSize(40),
		// width: transformSize(570),
		alignItems: 'center',
		justifyContent: 'center',
		// backgroundColor: '#fff',
		flex: 1,
	},
	imgWrap: {

		width: transformSize(490),
		height: transformSize(688),
		// alignItems: 'center',
		// justifyContent: 'center',
		backgroundColor: "white",

	},
	itemImg: {
		width: transformSize(490),
		height: transformSize(688),
		borderRadius: transformSize(10),
		overlayColor: "white"

	},

	itemTitle: {
		marginTop: transformSize(50),
		fontSize: transformSize(40),
		width: transformSize(490),
		textAlign: 'center',
		color: '#000',
	},
	itemSummary: {
		marginTop: transformSize(30),
		fontSize: transformSize(30),
		width: transformSize(490),
		color: '#999',
		textAlign: 'center',
		lineHeight: transformSize(44)
	},
})