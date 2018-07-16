import React from 'react';
import { Platform, StyleSheet, ScrollView, View, Image, Icon, Touchable, FlowList, Text, Tabs, TabView } from '@components';
import { Dimensions, ViewPagerAndroid, Animated, DeviceEventEmitter } from 'react-native';
import { transformSize, commonStyle } from '@utils';
import { http } from '@services';
const { height, width } = Dimensions.get("window");
import {
	HomeItemVideo
} from '@modules/home/components';
import { FindItem, SquareItemMy, InterestingNew } from './components';
import { umengTrack } from '@utils'

import { connect } from 'react-redux';
let mapStateToProps = (state) => {
	return {
		user: state.user
	};
};
@connect(mapStateToProps)
export default class MyFavorite extends React.Component {
	static navigationOptions = {
		title: '我的收藏',
		headerStyle: {
			backgroundColor: '#fff',
			borderBottomWidth: transformSize(1),
			borderBottomColor: "#e5e5e5",
			elevation: 0,
			backgroundColor: 'white'
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			isReload: false,
			ViewPageIndex: 0,
			loading: false,
			tabTitle: ['趣文', '视频', '广场', '找到'],
			data: {},
			refresh: false
		}
		this.videoData = []
		this.ParamsVideo = {
			pageNo: 1,
			pageSize: 20
		}
	}
	componentDidMount = () => {
		DeviceEventEmitter.addListener('CancelCollection', () => {
			this.setState({
				refresh: !this.state.refresh
			});
		});
	}
	render() {

		let { ViewPageIndex, tabTitle } = this.state;
		return (
			<View style={s.MyFavoriteWrap}>
				{/* <Tabs
					options={tabTitle}
					styleTab={[s.tabs]}
					goToTab={this.goToTab}
					ViewPageIndex={this.state.ViewPageIndex}
				>
				</Tabs> */}
				<TabView style={{ flex: 1, backgroundColor: "white", elevation: 0 }}>
					{tabTitle.map(this.renderViewPage)}
				</TabView>
				{/* {this.renderMain()} */}
			</View>
		)
	}

	renderViewPage = (item, index) => {
		let renderItem = null;
		let style = null;
		let requests = {
			'趣文': {
				url: `/services/app/v1/follow/list`,
				params: {
					moduleCode: '1002',
					userId: this.props.user.userId,
					contentFlag: 0
				}
			},
			'视频': {
				url: `/services/app/v1/follow/list`,
				params: {
					moduleCode: '1002',
					userId: this.props.user.userId,
					contentFlag: 1
				}
			},
			'广场': {
				url: `/services/app/v1/follow/list`,
				params: {
					moduleCode: '1012',
					userId: this.props.user.userId,
				}
			},
			'找到': {
				url: `/services/app/v1/follow/list`,
				params: {
					moduleCode: '1010',
					userId: this.props.user.userId,
				}
			}
		}
		// let ItemSeparatorComponent
		if (item === '趣文') {
			renderItem = ({ item }) => {
				return <InterestingNew
					goToDetail={() => this.goToDetail(item.infoId)}
					data={item} />
			}

		} else if (item === '视频') {
			renderItem = ({ item, index }) => {

				return <HomeItemVideo
					data={item}
					style={{ paddingVertical: transformSize(30) }}
					goToDetail={() => this.goToDetailVideo(item, index)} />
			}
		} else if (item === '广场') {
			renderItem = ({ item }) => {
				return <SquareItemMy
					data={item}
					goToDetail={(kid) => this.goToSquare(kid)}
				/>
			}

		} else if (item === '找到') {
			renderItem = ({ item }) => {
				return <FindItem
					data={item}
					goToDetail={() => this.goToFind(item)}
				/>
			}

		}
		return (
			<View tabLabel={item} key={index} style={s.listWrap}>
				{/* <FlatList
					data={data}
					renderItem={renderItem}
					style={s.flatlist}
					extraData={this.state}
					keyExtractor={this._keyExtractor}
					onRefresh={() => this.handleRefresh(index)}
					refreshing={false}
					ref={(ref) => this.flatlistRef(ref, index)}
					ListEmptyComponent={this.emptyComponent}
					onEndReached={() => this.handleLoadMore(index)}
					onEndReachedThreshold={0.4}
					ListFooterComponent={this.renderFooter}
				/> */}

				<FlowList
					request={requests[item]}
					ref={`_flowlist_${index}`}
					renderItem={renderItem}
					onFetchedData={(data, res) => { this.onFetchedData(data, res, index) }}
					style={{ width: Dimensions.get("window").width }, index === 1 ? {marginTop: -transformSize(30)} : {marginTop: -transformSize(50)}}
				// ItemSeparatorComponent={() => ItemSeparatorComponent}
				/>
			</View>
		)
	}

	goToTab = (index) => {
		if (Platform.OS === 'ios') {
			let offset_x = index * width
			this._refScrollView.scrollTo({ x: offset_x, y: 0, animated: true })
			this.setState({ ViewPageIndex: index })
		} else {
			this._refScrollView.setPage(index);
			this.setState({ ViewPageIndex: index })
		}
	}

	onPageSelected = (e) => {
		let ViewPageIndex = e.nativeEvent.position || 0;
		this.setState({ ViewPageIndex });
	}

	handleScrollEnd = (e) => {
		let offsetX = e.nativeEvent.contentOffset.x;
		let ViewPageIndex = offsetX / width
		this.setState({ ViewPageIndex })
	}
	goToDetail = (id) => {
		this.props.navigation.navigate('ArticleDetail', { id })
		umengTrack('文章详情', { '来源': '我的收藏' })
	}
	goToDetailVideo = (item, index) => {
		let videos = this.videoData

		let params = {
			currentIndex: index,
			videos: videos,
			onPageChange: (index) => {
				this.videoIndex = index
				this.refs["_flowlist_1"]._root.scrollToIndex({ viewPosition: 0, index: Math.floor(index / 2) })
			},
			loadMoreData: async () => {

				let pageNo = this.refs["_flowlist_1"].state.pageNo
				let { pageSize } = this.ParamsVideo
				let url = `/services/app/v1/follow/list/${pageNo}/${pageSize}`
				let params = {
					moduleCode: '1002',
					userId: this.props.user.userId,
					contentFlag: 1
				}
				let data = (await http({ url, params })).data.data.entities
				this.videoData = [].concat(this.videoData, data)
				this.flowlist.setState({ pageNo: pageNo + 1 })
				this.refs["_flowlist_1"].updateData(this.videoData)
				return data

			},
		}
		this.props.navigation.navigate("VideoDetail", params)
		this.videoData[index].viewCount += 1
		this.refs["_flowlist_1"].updateData(this.videoData)

		// let components = (
		// 	<VideoScreen videos={videos} onClose={modal.close} currentIndex={index} />
		// )
		// modal.show(components)
	}
	goToSquare(kid) {
		this.props.navigation.navigate('SquareDetail', { id: kid })
	}
	goToFind = (item) => {
		// this.props.navigation.navigate("SeekOutDeatilPK", { id })
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
		this.props.navigation.navigate(goToPage, { id: item.infoId })

	}
	onFetchedData = (data, res, index) => {
		if (index === 1) {
			let videoDataLocal = data.map((item, index) => {
				return { ...item, author: { headImg: item.headImg, nickName: item.nickName, id: item.userId, type: item.userType }, id: item.infoId.toString() }
			})
			console.log("videoDataLocal", videoDataLocal)
			this.videoData = videoDataLocal
		}

	}
}

const s = StyleSheet.create({
	MyFavoriteWrap: {
		flex: 1,
		backgroundColor: '#fff',
	},
	tabs: {
		paddingTop: transformSize(30),
	},
	separatorStyle: {
		marginTop: transformSize(60),
	},
	listWrap: {
		paddingVertical: transformSize(20),
	}
})