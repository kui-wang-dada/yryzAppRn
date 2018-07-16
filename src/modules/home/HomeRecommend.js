import React, { Component } from 'react';
import { View, Platform, Icon, Image, Touchable, Message, Toast } from "@components";
import { Dimensions, FlatList, StyleSheet, Text, AsyncStorage, ActivityIndicator, ImageBackground, NetInfo } from 'react-native';
import { transformSize, commonStyle } from '@utils'
import { HomeItemHor, HomeItemVer, HomeItemVideo } from './components'
import { homeRecommend } from './api'
import { cache } from '@utils'
import { http } from '@services'
import { PKopacity } from './assets'
import { umengTrack } from '@utils'
const { height, width } = Dimensions.get("window")
import { connect } from 'react-redux'
let mapStateTopProps = ({ home }) => {
	return { home }
}
@connect(mapStateTopProps)
class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: 0,
			dataRecommend: null,
			emptyType: "loading"
		}
		this.ParamsRecommend = {
			ids: "",
			pageSize: 10,
			recommends: ""
		}
		this.getMoreLoading = false
		this.netStatus = 1   // 有网
	}

	render() {
		let { dataRecommend } = this.state;
		return (
			<View style={{ overflow: "hidden", height: "100%", width: width, }
			}>
				<View style={s.separation} ref={r => this._separation = r}></View>
				<FlatList
					data={dataRecommend}
					renderItem={this.renderItem}
					style={s.flatlist}
					// extraData={this.state}
					keyExtractor={this._keyExtractor}
					onRefresh={() => this.handleRefresh()}
					refreshing={false}
					ref="_flatlist"
					onScroll={this.handleScroll}
					ListEmptyComponent={this.renderEmptyComponent}
					onEndReached={() => this.handleLoadMore()}
					onEndReachedThreshold={0.1}
					ListFooterComponent={this.renderFooter}
				/>
			</View >
		)

	}

	componentDidMount = () => {

		NetInfo.getConnectionInfo().then((connectionInfo) => {

			this._handleConnectivityChange(connectionInfo);


		});
		NetInfo.addEventListener(
			'connectionChange',
			this._handleConnectivityChange
		);
	}

	componentWillUnmount() {
		NetInfo.removeEventListener(
			'connectionChange',
			this._handleConnectivityChange
		);

	}

	// 渲染推荐页面和趣文页面
	renderItem = ({ item, index }) => {
		let { videoUrl, coverImgType, contentFlag, coverPlanUrl, title } = item
		if (contentFlag === 2) {
			return (
				<Touchable onPress={() => this.goToPK(item)} type="withoutFeedback">
					<View style={s.findWrap}>
						<Image source={{ uri: coverPlanUrl }} style={s.findImg}></Image>
						<ImageBackground source={PKopacity} style={s.findOpacity}>
							<Text style={s.findTitle} numberOfLines={2}>{title}</Text>
						</ImageBackground>
					</View>
				</Touchable>
			)
		} else if (contentFlag === 1) {
			return (
				<HomeItemVideo
					data={item}
					goToDetail={() => this.goToDetailVideo(item, index)}
				></HomeItemVideo>
			)
		} else {
			if (coverImgType === 1) {
				return (
					<HomeItemHor
						data={item}
						goToDetail={() => this.goToDetail(item.id, index)}
					></HomeItemHor>
				)
			} else {
				return (
					<HomeItemVer
						data={item}
						goToDetail={() => this.goToDetail(item.id, index)}
					></HomeItemVer>
				)
			}
		}
	}

	// 渲染加载更多的菊花图
	renderFooter = () => {
		let { loading } = this.state
		if (loading === 2) {
			return (
				<View style={s.loadingWrap}>
					<ActivityIndicator
						animating={true}
						color='#666'
						size="small"
					/>
					<Text style={s.loading}>内容加载中</Text>

				</View>
			)
		} else if (loading === 1) {
			return (
				<View style={s.loadingWrap}>
					<Text style={{ color: "#999" }}>没有更多内容了</Text>
				</View>
			)
		} else {
			return (
				<View></View>
			)
		}
	}
	// 渲染没有数据的空页面
	renderEmptyComponent = () => {
		let { emptyType } = this.state
		if (emptyType === "loading") {
			return (
				<View style={s.loadingWrap}>
					<ActivityIndicator
						animating={true}
						color='#666'
						size="large"
					/>
				</View>)
		} else if (emptyType === "noData") {
			return (
				<Message preset="no-data"></Message>
			)
		}

	}
	handleScroll = (e) => {
		let contentY = e.nativeEvent.contentOffset.y
		if (contentY >= 30) {
			this._separation.setNativeProps({ height: transformSize(2) })
		} else {
			this._separation.setNativeProps({ height: 0 })
		}
	}
	// 网络环境
	_handleConnectivityChange = (connectionInfo) => {
		let status = connectionInfo.type;
		let { narmalIds, recommendIds } = this.props.home
		let params = {
			ids: narmalIds.join(","),
			pageSize: 10,
			recommends: recommendIds.join(",")
		}
		this.getHomeRecommend(params)
		// none wifi other unknown
		// alert(JSON.stringify(connectionInfo))
		if (status === 'none') {
			Toast.show("当前网络不可用，请检查网络设置")
			this.netStatus = 2   // 无网
			this.setState({ emptyType: "noData" })
		} else if (status === 'unknown') {
			this.setState({ emptyType: "noData" })
			this.netStatus = 2   // 无网
		} else {
			// 当前无WiFi连接，继续播放将消耗您的自有流量
			this.netStatus = 1   // 有网
		}

	}
	// 三个页面下拉刷新逻辑
	handleRefresh = () => {

		if (this.netStatus === 2) {
	
			Toast.show("当前网络不可用，请检查网络设置")
			return
		}
		this.handleLoadMore("top")

	}
	// 三个页面上拉加载更多逻辑
	handleLoadMore = async (type) => {
		if (this.netStatus === 2) {
			Toast.show("当前网络不可用，请检查网络设置")
			return
		}
		if (this.getMoreLoading) {
			return
		}
		this.getMoreLoading = true
		this.setState({ loading: 2 })
		let params = this.ParamsRecommend
		let dataRecommend
		let dataCache
		let res = (await http({ url: homeRecommend, params }))
		let data = res.data.data

		if (data.length) {
			this.handleParams(data)

			if (type === "top") {
				dataRecommend = [].concat(data, this.state.dataRecommend)
			}
			else {
				dataRecommend = [].concat(this.state.dataRecommend, data)
			}
			if (dataRecommend.length > 20) {
				dataCache = dataRecommend.slice(0, 20)
			} else {
				dataCache = dataRecommend
			}
			this.props.dispatch({ type: "DATA_CACHE", payload: { dataCache: dataCache } })


			this.setState({ dataRecommend, loading: 0 }, () => { this.getMoreLoading = false })
		} else {
			this.setState({ loading: 1 })
		}

	}
	goToTop = () => {
		this.refs._flatlist.scrollToIndex({ viewPosition: 0, index: 0 })
	}

	/*
	跳转页面相关
	*/

	// 文章详情页跳转
	goToDetail = (id, index) => {
		this.props.navigation.navigate('ArticleDetail', { id })
		this.handleViewCount(index)
		umengTrack('文章详情', { '来源': '首页推荐' })
	}
	goToDetailVideo = (item, index) => {

		let params = {
			id: item.id
		}
		this.props.navigation.navigate("VideoDetail", params)
		this.handleViewCount(index)
		umengTrack('视频详情', { '来源': '首页_推荐' })
		// let components = (
		// 	<VideoScreen videos={videos} onClose={modal.close} currentIndex={index} />
		// )
		// modal.show(components)
	}
	goToPK = (item) => {
		let { configType, id } = item

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

		this.props.navigation.navigate(goToPage, { id, type: 0 })
		umengTrack('找到详情', { '来源': '首页_推荐' })
	}
	/*
	请求数据相关
	*/
	// 首页推荐数据
	getHomeRecommend = async (params) => {
		let url = homeRecommend
		let dataCache = this.props.home.dataCache
		if (dataCache) {
			this.setState({
				dataRecommend: dataCache
			})
		}

		let res = await http({ url, params });
		let dataRecommend = res.data.data

		this.handleParams(dataRecommend)
		if (dataRecommend.length) {

			this.setState({
				dataRecommend: dataRecommend
			})
			this.props.dispatch({ type: "DATA_CACHE", payload: { dataCache: dataRecommend } })
		} else {
			this.setState({
				emptyType: "noData"
			})
		}


	}

	// 数据请求参数处理方法
	handleParams = (data) => {
		let { ids, recommends } = this.ParamsRecommend
		ids = ids ? ids.split(",") : []
		recommends = recommends ? recommends.split(",") : []
		data.forEach(ele => {
			if (ele.recommendIndex) {
				recommends.push(ele.id)
			} else {
				ids.push(ele.id)
			}
		})
		this.ParamsRecommend.ids = ids.join(",")
		this.ParamsRecommend.recommends = recommends.join(",")

		// redux推入30条推荐和300条文章
		let { narmalIds, recommendIds } = this.props.home
		if (ids.length > 300) {
			narmalIds = ids.slice(-300)
		} else {
			narmalIds = ids
		}
		if (recommends.length > 30) {
			recommendIds = recommends.slice(-30)
		} else {
			recommendIds = recommends
		}
		this.props.dispatch({ type: "NARMAL_IDS", payload: { narmalIds } })
		this.props.dispatch({ type: "RECOMMEND_IDS", payload: { recommendIds } })


	}

	handleViewCount = (index) => {
		let { dataRecommend } = this.state
		dataRecommend[index].viewCount += 1
		this.setState({ dataRecommend })
	}
	_keyExtractor = (item, index) => index.toString();


}
const s = StyleSheet.create({

	homeWrap: {
		flex: 1,

		backgroundColor: '#fff',
	},
	flatlist: {
		width: width,
		marginTop: -transformSize(30)
	},
	tabs: {
		paddingTop: transformSize(30),
		marginTop: Platform.OS === "ios" ? transformSize(40) : 0,
	},
	separation: {
		// height: transformSize(2),
		width: width,
		// elevation: 1,
		backgroundColor: "#e5e5e5"
	},
	shadow: {
		backgroundColor: '#fff',
		shadowColor: '#eeeeee',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 3,
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
		height: transformSize(200),
		alignItems: 'center',
		justifyContent: 'center',
	},
	loading: {
		fontSize: transformSize(24),
		color: "#666",
		marginLeft: transformSize(16),
		marginRight: transformSize(16)
	},
	findWrap: {
		width: transformSize(669),
		height: transformSize(341),
		marginHorizontal: transformSize(40),
		marginVertical: transformSize(50),
		borderRadius: transformSize(10),
		justifyContent: 'flex-end',
		// overlayColor: "white",
	},
	findImg: {
		position: "absolute",
		borderRadius: transformSize(10),
		overlayColor: "white",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: transformSize(669),
		height: transformSize(341),
	},
	findOpacity: {
		width: transformSize(669),
		height: transformSize(110),
		justifyContent: 'flex-end',
	},
	findTitle: {
		color: "white",
		fontSize: transformSize(36),
		fontWeight: 'bold',
		letterSpacing: transformSize(2),
		marginLeft: transformSize(20),
		marginBottom: transformSize(22)

	}

})

export default HomeScreen;
