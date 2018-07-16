import React from 'react'
import {
	View, StyleSheet, ScrollView, Text, FlatList, Platform, DeviceEventEmitter
} from 'react-native'
import { transformSize, textSecondaryColor, cache } from '@utils';
import { http } from '@services';
import { Icon, Touchable, Message, Image } from '@components';
import SquareItem from './components/SquareItem'
import AppItem from './components/PopularAppItem'
import SearchBar from './components/Search'
import squareData from './mockData/DiscoverMockSquare'
import appData from './mockData/DiscoverMockApp'
import { Topping } from './assets'
import { SCREEN_HEIGHT } from '@utils/commonStyle';
import { connect } from 'react-redux';

export default class DiscoverScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			appList: [],
			squareList: [],
			showTop: false,
		};
		this.key = 0;
		this.squarePage = 2;
		this.subscription = DeviceEventEmitter.addListener('onNavigationStateChange', (events) => {
			let { currentScreen, prevScreen } = events;
			if (currentScreen === '发现' && ['首页', '我的', '找到'].indexOf(prevScreen) >= 0) {
				this.key++;
				this.fetchData();
			}
		})
	}

	static navigationOptions = ({ navigation, screenProps }) => ({
		headerLeft: null,
		headerRight: null,
		headerTitle: <SearchBar navigation={navigation} hotWords={'请输入关键字'} />,
		headerStyle: {
			height: transformSize(108),
			backgroundColor: '#fff',
			borderBottomWidth: 0,
			elevation: 0,
		}
	})

	componentWillUnmount() {
		// 移除
		this.subscription.remove();
	};

	fetchData() {
		if (Platform.OS === 'android') {
			this.fetchPopularApp();
		}
		this.fetchHotSquare();
	}

	fetchHotSquare = async () => {
		cache({ url: `/services/app/v1/square/list/1/10`, method: 'get' }, (res) => {
			let { entities: squareArr = [] } = res.data.data
			this.setState({ squareList: squareArr })
		});
	}

	fetchPopularApp = async () => {
		cache({ url: `/services/app/v1/application/hot/list`, method: 'get' }, (res) => {
			let { data: appArr = [] } = res.data
			this.setState({ appList: appArr })
			this.squarePage = 2;
		});
	}

	render() {
		return (
			<View style={s.wrapper}>
				{this.renderContent()}
			</View>
		)
	}

	renderContent() {
		let { squareList, appList } = this.state
		// let { entities: squareList } = squareData.data
		// let { data: appList } = appData
		if (Platform.OS === 'ios') {
			return this.renderSquare(squareList, false)
		} else {
			return (
				<ScrollView showsVerticalScrollIndicator={false}>
					{this.renderSquare(squareList, true)}
					<View style={s.divider} />
					{this.renderApp(appList)}
				</ScrollView>
			);
		}
	}

	renderSquare(data, android) {
		return (
			<View style={s.squareWrapper}>
				<Text style={[s.tip, { marginLeft: transformSize(40) }]}>广场热议</Text>
				{this.renderSquareList(data, android)}
				{this.renderTopping(android)}
			</View>
		);
	}

	renderSquareList(data, android) {
		if (!android) {
			return (
				<FlatList
					ref={(ref) => { this.FlatList = ref; }}
					data={data}
					horizontal={false}
					renderItem={({ item, index }) =>
						<SquareItem
							navigation={this.props.navigation}
							key={index}
							data={item}
							wrapper />
					}
					style={{ marginTop: transformSize(42), marginHorizontal: transformSize(28) }}
					refreshing={false}
					onScroll={this.onScroll}
					onRefresh={() => this.handleLoadMore('top')}
					onEndReached={() => this.handleLoadMore('bottom')}
					onEndReachedThreshold={0.1}
					keyExtractor={(item, index) => index.toString()}
					ItemSeparatorComponent={() => (<View style={{ height: transformSize(84) }} />)}
					showsVerticalScrollIndicator={false} />
			);
		} else {
			return (
				<FlatList
					key={this.key}
					ref={(ref) => { this.FlatList = ref; }}
					data={data}
					horizontal={true}
					renderItem={({ item }) =>
						<SquareItem
							navigation={this.props.navigation}
							data={item} />}
					style={{ marginTop: transformSize(42), marginHorizontal: transformSize(32) }}
					ListEmptyComponent={() => (<Message type="no-data" />)}
					refreshing={false}
					onScrollBeginDrag={this.onScrollBegin}
					onScrollEndDrag={this.onScrollEnd}
					onRefresh={() => this.handleLoadMore('top')}
					onEndReached={() => this.handleLoadMore('bottom')}
					onEndReachedThreshold={0.1}
					keyExtractor={(item, index) => index.toString()}
					ItemSeparatorComponent={() => (<View style={{ width: transformSize(20) }} />)}
					showsHorizontalScrollIndicator={false} />
			);
		}
	}

	renderTopping(android) {
		if (!android && this.state.showTop)
			return (
				<Touchable onPress={() => this.goToTop()} style={s.toppingWrapper}  >
					<Image style={s.toppingIcon} source={Topping} />
				</Touchable>
			);
		else
			return null

	}

	goToTop = () => {
		this.FlatList.scrollToIndex({ viewPosition: 0, index: 0 })
	}

	onScroll = (e) => {
		let { contentOffset } = e.nativeEvent
		this.setState({ showTop: contentOffset.y > SCREEN_HEIGHT })
	}

	onScrollBegin = (e) => {
		let { contentOffset } = e.nativeEvent
		let x = contentOffset.x
		this.beginPoint = x
	}

	onScrollEnd = (e) => {
		let { contentOffset } = e.nativeEvent
		let x = contentOffset.x
		let index

		if (x === this.beginPoint)
			return;

		if (x - this.beginPoint > 0) {
			index = Math.floor((x + transformSize(440)) / transformSize(544))
		} else {
			index = Math.floor((x - transformSize(100)) / transformSize(544))
		}
		console.log('zxw', index + '-----' + this.state.squareList.length)
		console.log('zxw', this.beginPoint + '-----' + contentOffset.x)
		if (index >= this.state.squareList.length)
			index = this.state.squareList.length - 1
		if (index < 0)
			index = 0
		this.FlatList.scrollToIndex({ viewPosition: 0, index: index })
	}

	handleLoadMore = (direction) => {
		console.log('zxw', direction)
		if (direction === 'top') {
			this.squarePage = 2
			this.fetchHotSquare()
		} else {
			http({ url: `/services/app/v1/square/list/${this.squarePage}/10`, method: 'get' }).then(res => {
				let { entities: squareArr = [] } = res.data.data
				let squareList = [].concat(this.state.squareList, squareArr)
				if (squareArr.length > 0) {
					this.squarePage = this.squarePage + 1
					this.setState({ squareList })
				}
			}).catch(err => {
				console.log('zxw', err)
			})
		}
	}

	renderApp(data) {
		return (
			<View style={s.appWrapper}>
				{this.renderMore()}
				{this.renderAppItem(data)}
			</View>
		);
	}


	renderMore() {
		return (
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text style={s.tip}>热门应用</Text>
				<Touchable onPress={() => this.props.navigation.navigate('Categories')}>
					<View style={s.moreWarpper}>
						<Icon size={transformSize(24)} color={'#7154d1'} name="all" />
						<Text style={s.moreText}>全部</Text>
					</View>
				</Touchable>
			</View>
		);
	}

	renderAppItem(data) {
		if (data && data.length !== 0) {
			return data.map((item, index) => (<AppItem navigation={this.props.navigation} key={index} data={item} />));
		} else {
			return (<Message type="no-data" />);
		}
	}
}

const s = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: 'white',
		overflow: 'hidden',
	},
	tip: {
		fontSize: transformSize(42),
		overflow: 'hidden',
		color: '#000',
		padding: 0,
		includeFontPadding: false,
		fontWeight: 'bold',
	},
	searchBarWrap: {
		width: '100%',
		height: transformSize(64),
		paddingHorizontal: transformSize(40),
		marginVertical: transformSize(24),
	},
	searchInput: {
		flex: 1,
		flexDirection: 'row',
		borderRadius: transformSize(10),
		backgroundColor: '#f4f4f4',
		overflow: 'hidden',
		paddingHorizontal: transformSize(20),
		alignItems: 'center',
	},
	searchIcon: {
		fontSize: transformSize(24),
		height: transformSize(24),
		color: '#999',
	},
	hotword: {
		fontSize: transformSize(32),
		color: '#999',
		marginLeft: transformSize(10),
		alignSelf: 'center',
	},
	squareWrapper: {
		flex: 1,
		paddingTop: transformSize(36),
	},
	divider: {
		height: transformSize(20),
		marginTop: transformSize(64),
		backgroundColor: '#f7f7f7'
	},
	appWrapper: {
		paddingTop: transformSize(82),
		paddingHorizontal: transformSize(40),
		paddingBottom: transformSize(60),
	},
	moreWarpper: {
		flexDirection: 'row',
		width: transformSize(124),
		height: transformSize(42),
		backgroundColor: '#f4f4f4',
		borderRadius: transformSize(21),
		justifyContent: 'center',
		alignItems: 'center',
	},
	moreText: {
		fontSize: transformSize(26),
		marginLeft: transformSize(10),
		overflow: 'hidden',
		color: '#7154d1',
		padding: 0,
		includeFontPadding: false,
	},
	toppingWrapper: {
		position: 'absolute',
		right: transformSize(40),
		bottom: transformSize(50),
		backgroundColor: 'transparent'
	},
	toppingIcon: {
		width: transformSize(96),
		height: transformSize(96),
		resizeMode: 'stretch',
		backgroundColor: 'transparent'
	}
});
