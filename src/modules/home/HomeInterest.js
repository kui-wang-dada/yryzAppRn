import React, { Component } from 'react';
import { View, Platform, Touchable, Tabs, Icon, TabView, UpdateModal, FlowList, Message, Toast } from "@components";
import {
	Dimensions,
	FlatList,
	StyleSheet,
	Text,
	NetInfo
} from 'react-native';
import { transformSize, commonStyle, modal } from '@utils'
import {
	HomeItemHor,
	HomeItemVer,
	HomeItemVideo,

} from './components'

import {

	homeVideo,
	homeInterest,
	homeInterestTab
} from './api'
import { cache } from '@utils'
import { http } from '@services'

import { umengTrack } from '@utils'
const { height, width } = Dimensions.get("window")


class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabItemKid: 0,
			dataHomeTab: null,
			data: null
		}
		this.ParamsInterest = {
			pageNo: 1,
			pageSize: 20,
			InterestKid: 1
		}
		this.netStatus = 1  // 有网
		this.tabIndex = 0
		this.contentY = []
		this.cacheLocal = []

	}
	render() {
		let { dataHomeTab } = this.state
		if (dataHomeTab) {
			return (
				<View style={{ overflow: "hidden", height: "100%", width: width }}>
					<FlatList
						horizontal={true}
						data={dataHomeTab}
						ref={(s) => this._tabFlatlist = s}
						renderItem={this.renderTabItem}
						style={[s.tabFlatlist]}
						contentContainerStyle={{ alignItems: "center", paddingLeft: transformSize(20), paddingRight: transformSize(20), height: transformSize(80) }}
						keyExtractor={this._keyExtractor}
						showsHorizontalScrollIndicator={false}
					/>
					<View style={s.separation}></View>
					{this.renderMain()}

				</View>
			)
		} else {
			return <Message preset="no-data"></Message>
		}

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
	renderMain = () => {
		let { data } = this.state

		return (
			<FlatList
				data={data}
				renderItem={this.renderItem}
				style={s.flatlist}
				extraData={this.state}
				keyExtractor={this._keyExtractor}
				refreshing={false}
				onRefresh={() => this.handleRefresh()}
				ref="_flatlist"
				onScroll={this._onScroll}
				ListEmptyComponent={this.renderEmptyComponent}
				ListFooterComponent={this.renderFooter}
			/>
		)
	}

	// 渲染二级tab
	renderTabItem = ({ item, index }) => {
		let { classifyName, kid } = item
		let tabItem = [s.tabItem]
		let tabItemWrap = [s.tabItemWrap]
		if (kid === this.state.tabItemKid) {
			tabItem.push(s.tabActiveItem)
			tabItemWrap.push(s.tabActiveItemWrap)
		}
		if (index === 0) {
			tabItem.push({ marginLeft: 0 })
		}

		return (
			<Touchable style={tabItemWrap} onPress={this.goToTab_2(item, index)}>
				<Text style={tabItem} >{classifyName}</Text>
			</Touchable>
		)
	}

	// 渲染推荐页面和趣文页面
	renderItem = ({ item, index }) => {
		let { videoUrl, coverImgType } = item
		if (videoUrl) {
			return (
				<HomeItemVideo
					data={item}
					goToDetail={() => this.goToDetailVideo(item, index)}
				></HomeItemVideo>
			)
		}
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

	// 渲染加载更多的菊花图
	renderFooter = () => {
		let { loading } = this.state
		if (loading) {
			return (
				<View style={s.loadingWrap}>
					<Icon name='change' size={20}></Icon>
					<Text style={s.loading}>内容加载中</Text>
					<Icon name="more" size={4} ></Icon>
				</View>
			)
		} else {
			return null
		}
	}
	// 渲染没有数据的空页面
	renderEmptyComponent = () => {
		return (
			<Message preset="no-data"></Message>
		)
	}
	handleRefresh = () => {
		let { tabItemKid } = this.state
		this.getHomeInterest(tabItemKid)
	}
	_onScroll = (e) => {
		let { tabItemKid, dataHomeTab } = this.state
		let scrollIndex = 0
		dataHomeTab.forEach((ele, index) => {
			if (tabItemKid === ele.kid) {
				scrollIndex = index
			}
		})
		this.contentY[scrollIndex] = e.nativeEvent.contentOffset.y

	}

	_handleConnectivityChange = (connectionInfo) => {
		let status = connectionInfo.type;

		// none wifi other unknown
		// alert(JSON.stringify(connectionInfo))
		if (status === 'none') {
			this.netStatus = 2
		} else if (status === 'unknown') {
			this.netStatus = 2

		} else {
			// 当前无WiFi连接，继续播放将消耗您的自有流量
			this.netStatus = 1

			this.getHomeInterestTab()
		}

	}
	/*
	跳转页面相关
	*/

	// 二级页面tab点击或跳转
	goToTab_2 = (item, index) => () => {
		this.tabIndex = index
		let { tabItemKid } = this.state
		let { classifyName, kid } = item
		this.setState({
			tabItemKid: kid
		})
		if (tabItemKid === kid) {
			this.getHomeInterest(kid)
		} else {
			if (index === this.contentY.length - 1) {
				this._tabFlatlist.scrollToIndex({ viewPosition: 1, index: index })
			} else if (index === this.contentY.length - 2) {
				this._tabFlatlist.scrollToIndex({ viewPosition: 1, index: index + 1 })
			}
			else {
				this._tabFlatlist.scrollToIndex({ viewPosition: 0.5, index: index })
			}

			if (this.cacheLocal[index]) {
				this.setState({
					data: this.cacheLocal[index]
				})
				this.refs._flatlist.scrollToOffset({ offset: this.contentY[index] })
			} else {
				this.getHomeInterest(kid)
			}



		}



		umengTrack('趣文_一级分类', { "分类名称": classifyName, "分类ID": kid })
	}

	goToTop = () => {
		this.refs._flatlist.scrollToIndex({ viewPosition: 0, index: 0 })
	}
	// 文章详情页跳转
	goToDetail = (id, index) => {
		this.props.navigation.navigate('ArticleDetail', { id })
		this.handleViewCount(index)
		umengTrack('文章详情', { '来源': '首页_趣文列表' })
	}
	// 视频详情页跳转
	goToDetailVideo = (id, index) => {
		let videos = this.state.dataVideo;
		let params = {
			currentIndex: index,
			videos: videos,
			onPageChange: (index) => {
				// alert("onPageChange")
			},
			loadMoreData: async () => {
				this.ParamsVideo.pageNo += 1
				let { pageNo, pageSize } = this.ParamsVideo
				let url = `${homeVideo}/${pageNo}/${pageSize}`
				let data = (await http({ url })).data.data.entities
				let dataVideo = [].concat(this.state.dataVideo, data)
				this.setState({ dataVideo }, () => { this.getMoreLoading = false })
				// alert(data);
				return data
			},
		}
		this.props.navigation.navigate("VideoDetail", params)
		this.handleViewCount(index)

		// let components = (
		// 	<VideoScreen videos={videos} onClose={modal.close} currentIndex={index} />
		// )
		// modal.show(components)
	}
	/*
	请求数据相关
	*/
	// 趣文列表数据

	// 趣文二级tab数据
	getHomeInterestTab = () => {
		let url = homeInterestTab
		cache(url, (res) => {
			let dataHomeTab = res.data.data;

			this.setState({
				dataHomeTab,
				tabItemKid: dataHomeTab[0].kid
			}, () => {
				this.getHomeInterest(dataHomeTab[0].kid)
				this.contentY = this.state.dataHomeTab.map((item, index) => { return 0 })
				this.cacheLocal === this.state.dataHomeTab.map((item, index) => { return [] })
			})
		})
	}

	getHomeInterest = (classifyId) => {
		this.ParamsInterest.pageNo = 1
		let { pageNo, pageSize } = this.ParamsInterest
		let url = `${homeInterest}/${pageNo}/${pageSize}`

		let params = {
			classifyId: classifyId
		}
		cache({ url, params }, (res, type) => {
			let data = res.data.data.entities;
			this.setState({
				data
			}, () => {
				if (data.length) {
					this.refs._flatlist.scrollToIndex({ viewPosition: 0, index: 0 })
				}
			})
			this.cacheLocal[this.tabIndex] = data
		})
	}
	handleViewCount = (index) => {
		let { data } = this.state
		data[index].viewCount += 1
		this.setState({ data })
	}

	_keyExtractor = (item, index) => index.toString();


}
const s = StyleSheet.create({

	flatlist: {
		width: width,
		height: height - transformSize(200)

	},
	separation: {
		height: transformSize(2),
		width: width,
		// elevation: 1,
		backgroundColor: "#e5e5e5"
	},

	tabFlatlist: {
		paddingLeft: transformSize(20),
		// flex: 1,
		paddingRight: transformSize(20),
		height: transformSize(100),
		// marginBottom: transformSize(5)
	},
	tabItemWrap: {
		height: transformSize(54),
		// marginTop: transformSize(30),
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
