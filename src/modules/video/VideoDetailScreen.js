
import React, { Component } from 'react';
import {
	View,
	FlatList,
	Dimensions,
	StyleSheet,
	Image,
	TouchableOpacity,
	Platform,
	NetInfo,
	Alert,
	InteractionManager
} from 'react-native';

// import { PropTypes } from 'prop-types'
import VideoDetailView from './components/VideoDetailView'
import { PropTypes } from 'prop-types'

import { detailNavigationBack } from './assets'
import { detail, behavior } from './service/VideoService'
import Toast from '../../components/Toast'
import { SCREEN_WIDTH, transformSize } from '@utils/commonStyle'
import { click } from './service/VideoService'
import { KeyboardModule } from '@native-modules'
import { withUser } from '@modules/user'
import { connect } from 'react-redux'
import { isIphoneX } from '@utils'

const PrepareLoadCount = 3; // 建议用奇数
let mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};
@connect(mapStateToProps)
@withUser(false)
export default class VideoDetailScreen extends Component {

	static defaultProps = {
		id: 0,
		currentIndex: 0,
		videos: [],
	};

	static propTypes = {
		...View.propTypes,
		id: PropTypes.number,	// 单个视频时使用，传视频id
		currentIndex: PropTypes.number,	// 当前索引
		videos: PropTypes.array,		// 视频
		onPageChange: PropTypes.func,	// 页面切换回调
		loadMoreData: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.scrollBeginDrag = false;
		this.scrollEndDrag = false;
		this.currentIndex = 0;     // 当前播放索引
		this.notDetermined = false;
		this.loadMoreDataFlag = false;
		this.goBack = false;

		this.state = {
			videos: [],
			scrollEnabled: true,
			network: 'unknown',		// 网络状态: none wifi other unknown
			allowPlay: false
		};

		if (this.props.navigation.state.params.id) {
			this._fetchVideoDetail(this.props.navigation.state.params.id);
		} else {
			let params = this.props.navigation.state.params;
			// 列表
			this._appendVideos(params.videos);
			this._updateVideos(this.props.navigation.state.params.currentIndex);
			// 拉取视频用户行为数据
			this._fetchUserBehavior(params.videos);
		}
	}

	_fetchVideoDetail = async (id) => {
		// 路由: 获取视频详情数据
		let responseData = await detail(id);
		let aVideo = responseData.data.data;
		if (aVideo) {
			this._appendVideos([aVideo]);
			this._updateVideos(this.props.navigation.state.params.currentIndex);
		} else {
			// 找不到视频
			Toast.show('视频不存在');
			this.props.navigation.pop();
		}
	}

	_fetchUserBehavior = async (newVideos) => {
		let ids = newVideos.map((video) => {
			return video.id;
		}).filter((id) => {
			return id !== '';
		}).join(',');

		if (ids && ids !== '') {
			let responseData = await behavior(ids);
			let userBehaviors = responseData.data.data;

			let videos = this.state.videos;

			// 匹配
			for (let id in userBehaviors) {
				let value = userBehaviors[id];
				let item = this._matchVideo(id, videos);
				if (item.video && value) {
					let newVideo = { ...item.video, behavior: value }
					// alert(videoIndex);
					this._replaceVideo(item.index, newVideo, videos);
				}
			}

			this.setState({
				videos: videos,
			})
		}
	}

	_matchVideo = (videoId, videos) => {
		let videoIndex = -1;
		let video = videos.filter((video, index) => {
			let isEqual = (video.id === videoId);
			if (isEqual === true) {
				videoIndex = index;
			}
			return isEqual;
		})[0];
		return { index: videoIndex, video: video }
	}

	// 替换video，会修改videos元素
	_replaceVideo = (index, newVideo, videos) => {
		if (index >= 0 && videos.length > index && newVideo) {
			videos.splice(index, 1, newVideo);
		}
	}

	_appendVideos = (videos) => {
		let appendVideos = this.state.videos;
		for (let index = 0; index < videos.length; index++) {
			let video = videos[index];
			let newVideo = { ...video, isPlaying: false, isPrepareLoad: false };
			appendVideos.push(newVideo);
		}
		this.setState({
			videos: appendVideos,
		});
	}


	_loadMoreData = async () => {
		let videos = await this.props.navigation.state.params.loadMoreData();
		if (videos && videos.length > 0) {
			this.loadMoreDataFlag = false;
			this._appendVideos(videos);
			// 拉取视频用户行为数据
			this._fetchUserBehavior(videos);
		} else {
			this.loadMoreDataFlag = true;
		}
		this._back();
	}

	_back = () => {
		// 非单个视频时需要返回
		if (this.state.videos.length > 1 && this.loadMoreDataFlag === false && this.canBack === true) {
			this.props.navigation.pop();
		}
	}

	_updateVideoListView = (currentIndex) => {
		if (currentIndex !== this.currentIndex) {
			// 通知回调
			if (this.props.navigation.state.params.onPageChange) {
				this.props.navigation.state.params.onPageChange(currentIndex);
			}
			this._updateVideos(currentIndex);
		}
		if (currentIndex > this.state.videos.length - PrepareLoadCount && this.loadMoreDataFlag === false) {
			this.loadMoreDataFlag = true; // 未实现loadMoreData回调，或者某次回调数为0时，置为true
			// 拉取更多数据
			if (this.props.navigation.state.params.loadMoreData) {
				this._loadMoreData();
			}
		}
	}

	_updateVideos = (currentIndex) => {
		if (currentIndex === undefined) {
			currentIndex = 0;
		}
		let videos = this.state.videos;

		// 1. 清除上一次播放状态
		let lastVideo = videos[this.currentIndex];
		if (lastVideo) {
			lastVideo.isPlaying = false;
			videos.splice(this.currentIndex, 1, lastVideo);
		}

		// 2. 清除上一次预加载
		this._updatePrepareLoad(videos, this.currentIndex, false);

		// 3. 设置当前播放状态
		let currentVideo = videos[currentIndex];
		if (currentVideo) {
			currentVideo.isPlaying = true;
			videos.splice(currentIndex, 1, currentVideo);
		}

		// 4. 设置当前预加载
		this._updatePrepareLoad(videos, currentIndex, true);

		// 更新当前索引
		this.currentIndex = currentIndex;

		this.setState({
			videos: videos,
		})
		// alert(JSON.stringify(this.state.videos));

		// 新增浏览数  click
		if (Number.isInteger(currentIndex) && videos[currentIndex] && videos[currentIndex].id) {
			click(videos[currentIndex].id);
		}
	}

	_updatePrepareLoad = (videos, index, isPrepareLoad) => {
		let indexes = this._prepareLoadIndexes(index);
		for (let i = 0; i < indexes.length; i++) {
			const element = indexes[i];
			let video = videos[element];
			if (video) {
				video.isPrepareLoad = isPrepareLoad;
				videos.splice(element, 1, video);
			}
		}
	}

	_prepareLoadIndexes = (index) => {
		// 如果是非wifi环境则只有1个
		if (this.state.network !== 'wifi') {
			return [index];
		}
		let indexes = [];
		let count = Math.ceil(PrepareLoadCount / 2) - 1;
		if (index <= count) {
			// 0 ~ PrepareLoadCount
			for (let i = 0; i < PrepareLoadCount; i++) {
				indexes.push(i);
			}
		} else if (index > (this.state.videos.length - PrepareLoadCount)) {
			// ... ~ PrepareLoadCount
			for (let i = 1; i <= PrepareLoadCount; i++) {
				indexes.push(this.state.videos.length - i);
			}
		} else {
			// PrepareLoadCount ~ max - PrepareLoadCount
			// 后
			for (let i = 1; i <= count; i++) {
				let prepareIndex = index + i;
				indexes.push(prepareIndex);
			}
			// 中
			indexes.push(index);
			// 前
			for (let i = 1; i <= count; i++) {
				let prepareIndex = index - i;
				if (indexes.length < PrepareLoadCount) {
					indexes.push(prepareIndex);
				}
			}
		}
		indexes.sort();
		return indexes;
	}

	_scrollToIndex = (index, animated) => {
		if (this.state.videos.length > index && this.goBack === false/* 页面返回的时候不滚动 */) {
			InteractionManager.runAfterInteractions(() => {
				this._videoListView.scrollToIndex({ viewPosition: 0, index: index, animated: animated })
			});
		}
	}

	_onVideoEnd = () => {
		if (this.scrollBeginDrag === true) {
			return;
		}
		if (this.currentIndex < this.state.videos.length - 1) {
			let currentIndex = this.currentIndex + 1;
			this._scrollToIndex(currentIndex, true);
			this._updateVideoListView(currentIndex);
		} else {
			// 最后一个视频
			this.canBack = true;
			this._back();
		}
	};

	// 结束拖拽回调
	_onScrollEndDrag = (e) => {
		this.scrollEndDrag = true;
		this.scrollBeginDrag = false;
		if (Platform.OS === 'ios') {
			// only iOS code:
			let offsetX = e.nativeEvent.targetContentOffset.x;
			let currentIndex;
			if (offsetX <= 0) {
				currentIndex = 0;
			} else {
				let page = Math.ceil(offsetX / SCREEN_WIDTH + 0.5) - 1
				currentIndex = page;
			}
			this._updateVideoListView(currentIndex);
		}
	};

	_onMomentumScrollEnd = (e) => {
		if (Platform.OS === 'android') {
			// only Android code:
			let { contentOffset } = e.nativeEvent;
			let offsetX = contentOffset.x;
			let currentIndex;
			if (offsetX <= 0) {
				currentIndex = 0;
			} else {
				let page = Math.ceil(offsetX / SCREEN_WIDTH + 0.5) - 1
				currentIndex = page;
			}
			this._updateVideoListView(currentIndex);
		}
	}

	_onScrollBeginDrag = (e) => {
		this.scrollBeginDrag = true
	}

	_onClose = () => {
		this.goBack = true;
		this.props.navigation.pop();
	}

	_renderItem = ({ item }) => {
		let video = { ...item, network: this.state.network };
		if (video.isPrepareLoad === false) {
			video.videoUrl = '';
		}
		// network
		// 1. wifi 2. cell
		if (this.state.network !== 'wifi' && this.state.allowPlay === false) {
			video.isPlaying = false;
		}
		// alert(JSON.stringify(video));
		return <VideoDetailView
			style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
			videoInfo={video}
			onVideoEnd={this._onVideoEnd}
			onVideoStar={(id, isLike, likeCount) => {
				// this.props.videoInfo.id, this.props.videoInfo.behavior.likeCount + count
				let videos = this.state.videos;
				let { videoIndex, video } = this._matchVideo(id, videos);
				if (video) {
					video.behavior.likeFlag = isLike ? 1 : 0;
					video.behavior.likeCount = likeCount;
					this._replaceVideo(videoIndex, video, videos);
					this.setState({
						videos: videos,
					});
				}
			}}
			onVideoComment={(id, count) => {
				let videos = this.state.videos;
				let { videoIndex, video } = this._matchVideo(id, videos);
				if (video && video.behavior) {
					video.behavior.commentCount = count;
					this._replaceVideo(videoIndex, video, videos);
					this.setState({
						videos: videos,
					})
				}
			}}
			onVideoCollect={(id, isCollect, favoriteCount) => {
				let videos = this.state.videos;
				let { videoIndex, video } = this._matchVideo(id, videos);
				if (video) {
					video.behavior.favoriteFlag = isCollect ? 1 : 0;
					video.behavior.favoriteCount = favoriteCount;
					this._replaceVideo(videoIndex, video, videos);
					this.setState({
						videos: videos,
					})
				}
			}}
			onVideoShare={(id, count) => {
				let videos = this.state.videos;
				let { videoIndex, video } = this._matchVideo(id, videos);
				if (video) {
					video.behavior.shareCount = count;
					this._replaceVideo(videoIndex, video, videos);
					this.setState({
						videos: videos,
					})
				}
			}}
			onscrollEnabled={(scrollEnabled) => {
				if (scrollEnabled === false) {
					// 不能滚动时校正offset
					this._scrollToIndex(this.currentIndex, false);
				}
				if (this.state.scrollEnabled !== scrollEnabled) {
					this.setState({
						scrollEnabled: scrollEnabled
					})
				}
			}}
		/>
	};

	componentDidMount() {
		const currentIndex = this.props.navigation.state.params.currentIndex;
		if (currentIndex !== undefined && currentIndex > 0) {
			this._scrollToIndex(currentIndex, false);
			this._updateVideoListView(currentIndex);
		}
	}

	componentWillMount() {
		NetInfo.getConnectionInfo().then((connectionInfo) => {
			if (connectionInfo.type !== 'unknown') {
				this._handleConnectivityChange(connectionInfo);
			}
		});
		NetInfo.addEventListener(
			'connectionChange',
			this._handleConnectivityChange
		);
		if (Platform.OS === 'android') {
			KeyboardModule.changeKeyboardMode(KeyboardModule.nothing)
		}
	}

	componentWillUnmount() {
		NetInfo.removeEventListener(
			'connectionChange',
			this._handleConnectivityChange
		);
		if (Platform.OS === 'android') {
			KeyboardModule.changeKeyboardMode(KeyboardModule.resize)
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user !== this.props.user) {
			this._fetchUserBehavior(this.state.videos);
		}
	}

	_showAlert = () => {
		if (this.notDetermined) {
			return;
		}
		this.notDetermined = true;
		Alert.alert(
			'', '当前无WiFi连接，继续播放将消耗您的自有流量',
			[
				{
					text: '取消', onPress: () => {
						this.notDetermined = false;
						this._onClose();
					}, style: 'cancel'
				},
				{
					text: '确定', onPress: () => {
						this.notDetermined = false;
						this.setState({
							allowPlay: true
						});
					}
				},
			]
		)
	}

	_handleConnectivityChange = (connectionInfo) => {
		let status = connectionInfo.type;
		// none wifi other unknown
		// alert(JSON.stringify(connectionInfo))
		if (status === 'none') {
			Toast.show('当前网络不可用，请检查网络设置');
		} else if (status === 'unknown') {

		} else if (status === 'wifi') {

		} else {
			// 当前无WiFi连接，继续播放将消耗您的自有流量
			this._showAlert();
		}
		this.setState({
			network: status
		});
	}

	render() {
		let topStyle = null;
		if (isIphoneX() === true) {
			topStyle = { top: transformSize(80) };
		}
		return (
			<View style={styles.container}>
				<FlatList
					keyboardShouldPersistTaps='handled'
					style={{ marginTop: 0 }}
					ref={ref => { this._videoListView = ref; }}
					data={this.state.videos}
					getItemLayout={(data, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
					renderItem={this._renderItem}
					pagingEnabled={true}
					horizontal={true} // Platform.OS === 'android'
					showsHorizontalScrollIndicator={false}
					scrollEnabled={this.state.scrollEnabled}

					onScrollEndDrag={(e) => this._onScrollEndDrag(e)}
					onScrollBeginDrag={(e) => this._onScrollBeginDrag(e)}
					// onScroll={(e) => this._onScroll(e)}
					onMomentumScrollEnd={(e) => this._onMomentumScrollEnd(e)}
					keyExtractor={(item) => String(item.id)}
				/>
				{/* 导航栏 */}
				<View style={[styles.navigation, topStyle]}>
					<TouchableOpacity style={styles.navigationBack} onPress={this._onClose} activeOpacity={1}>
						<Image style={{ width: transformSize(60), height: transformSize(60), backgroundColor: 'transparent' }} source={detailNavigationBack} />
					</TouchableOpacity>
				</View>
			</View >
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000'
	},

	navigation: {
		position: 'absolute',
		width: '100%',
		top: transformSize(40),
		height: transformSize(88)
	},

	navigationBack: {
		backgroundColor: 'transparent',
		width: transformSize(60),
		height: transformSize(60),
		marginLeft: transformSize(30),
		marginTop: transformSize(14),
		alignItems: 'center',
		justifyContent: 'center'
	},
});