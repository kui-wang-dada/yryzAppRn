import React, { Component } from 'react';
import { Platform, FlowList, Toast } from "@components";
import { Dimensions, StyleSheet, NetInfo } from 'react-native';
import { transformSize, commonStyle, } from '@utils'
import { VideoItem } from './components'
import { homeVideo } from './api'
import { http } from '@services'
import { umengTrack } from '@utils'

const { height, width } = Dimensions.get("window")


class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
		this.data = null
		this.ParamsVideo = {
			pageNo: 1,
			pageSize: 20
		}
		this.netStatus = 1 // 有网
	}
	render() {
		return (
			<FlowList
				request={homeVideo}
				onFetchedData={this.onFetchedData}
				renderItem={this.renderItem}
				style={s.flowlist}
				onRefresh={this.handleRefresh}
				// ItemSeparatorComponent={this.ItemSeparator}
				numColumns={2}
				cacheFirstPage
				{...this.props}
				// onScroll={this.handleScroll}
				ref={r => this.flowlist = r}
			/>
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
	onFetchedData = (data, res) => {
		this.data = data
	}
	// 渲染视频页面
	renderItem = ({ item, index }) => {
		return (
			<VideoItem
				data={item}
				index={index}
				goToProfile={() => this.goToProfile(item.author)}
				goToDetail={() => this.goToDetailVideo(item.id, index)}
			></VideoItem>
		)
	}
	goToTop = () => {

		this.flowlist._root.scrollToIndex({ viewPosition: 0, index: 0 })
	}
	handleRefresh = () => {
		if (this.netStatus === 2) {
			Toast.show("当前网络不可用，请检查网络设置")
		}
	}

	// 网络相关
	_handleConnectivityChange = (connectionInfo) => {
		let status = connectionInfo.type;
		// none wifi other unknown
		// alert(JSON.stringify(connectionInfo))
		if (status === 'none') {
			Toast.show('当前网络不可用，请检查网络设置');
			this.netStatus = 2   // 无网
		} else if (status === 'unknown') {
			this.netStatus = 2   // 无网
		} else {
			// 当前无WiFi连接，继续播放将消耗您的自有流量
			this.netStatus = 1   // 有网
		}

	}

	/*
	跳转页面相关
	*/
	goToProfile = (author) => {
		let type
		let id
		if (author) {
			type = author.type
			id = author.id
		} else {
			type = 1
			id = 1
		}

		this.props.navigation.navigate("Profile", { type, id });
	}
	// 视频详情页跳转
	goToDetailVideo = (id, index) => {
		let videos = this.data
		let params = {
			currentIndex: index,
			videos: videos,
			onPageChange: (index) => {
				this.flowlist._root.scrollToIndex({ viewPosition: 0, index: Math.floor(index / 2) })
			},
			loadMoreData: async () => {
				let pageNo = this.flowlist.state.pageNo

				let url = `${homeVideo}/${pageNo}/20`
				let data = (await http({ url })).data.data.entities
				let dataVideo = [].concat(this.data, data)
				this.flowlist.setState({ pageNo: pageNo + 1 })
				this.flowlist.updateData(dataVideo)
				return data
			},
		}
		this.props.navigation.navigate("VideoDetail", params)
		this.data[index].viewCount += 1
		this.flowlist.updateData(this.data)
		umengTrack('视频详情', { '来源': '首页_视频列表' })
		// let components = (
		// 	<VideoScreen videos={videos} onClose={modal.close} currentIndex={index} />
		// )
		// modal.show(components)
	}
	/*
	请求数据相关
	*/


	_keyExtractor = (item, index) => index.toString();


}
const s = StyleSheet.create({

	homeWrap: {
		flex: 1,

		backgroundColor: '#fff',
	},
	flowlist: {
		width: width,
		marginTop: transformSize(20)
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
