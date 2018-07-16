import React, { Component } from 'react';
import { PropTypes } from 'prop-types'
import {
	View,
	StyleSheet,
	ImageBackground,
	Text,
	TouchableOpacity,
	ActivityIndicator,
	Slider,
	Platform,
	DeviceEventEmitter
} from 'react-native';
import store from '../../../store'

import VideoDetailBehaviorIcon from './VideoDetailBehaviorIcon'
import VideoCommentModal from '../VideoCommentModal'
import MySlider from './Slider'
import { VideoPlayView } from 'ydk-react-native'
import { transformSize, transformNum, umengTrack, modal, env, isIphoneX } from '@utils'
import { withNavigation, Share, Image } from '@components';
import { KeyboardModule } from '@native-modules'

import {
	detailStar,
	detailUnstar,
	detailCollect,
	detailUncollect,
	detailComment,
	detailForward,
	bigPlay,
	sliderThumbnail,
	sliderThumbnailNone,
	detailVideoThumbnail
} from '../assets'
import {
	homeVideoOpacity
} from '../../home/assets'
import { like, collect, share } from '../service/VideoService'
import Toast from '../../../components/Toast'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@utils/commonStyle';

const PlayerControlCriticalValue = 30; // 30s以下不显示时长和滑块
@withNavigation
export default class VideoDetailView extends Component {

	static propTypes = {
		...View.propTypes,
		videoInfo: PropTypes.object,	// 视频相关信息{包含用户作为信息 Behavior}
		onVideoEnd: PropTypes.func,

		onVideoStar: PropTypes.func,
		onVideoComment: PropTypes.func,
		onVideoCollect: PropTypes.func,
		onVideoShare: PropTypes.func,
		onscrollEnabled: PropTypes.func,
	};

	constructor(props) {
		super(props);
		this.callbackEnable = true;	// 是否回调播放结束
		this.videoPlayEnd = false;	// 视频播结束
		this.state = {
			sliderValue: 0,
			currentTime: 0,	// 毫秒
			duration: 0, // 毫秒
			isUserPause: false,
			isShowBigPlay: false,
			isShowThumbnail: true,
			sliderDisabled: true,
			loading: this.props.videoInfo.isPlaying,
			hasRenderComment: false,
			viewAppear: this.props.videoInfo.isPlaying
		};
	}

	// onVideoLoad
	_onVideoLoad = () => {
		this.setState({
			loading: true,
			isShowThumbnail: false
		});
	};

	_onVideoLoadEnd = () => {
		this.setState({
			loading: false,
		});
	};

	_onVideoProgress = (e) => {
		let duration = Math.round(e.nativeEvent.duration * 0.001);
		let currentTime = Math.round(e.nativeEvent.progress * 0.001);
		let value = currentTime / duration * 1.0;
		// console.log(duration, e.nativeEvent.progress)

		let state = this.state;
		state.sliderValue = value;
		state.currentTime = currentTime;
		state.duration = duration;
		state.loading = false;
		state.sliderDisabled = duration > PlayerControlCriticalValue ? false : true;
		this.setState(state);
	};

	_onVideoEnd = () => {
		if (this.onVideoEndEnable) {
			// 避免重复调用
			return;
		}
		this.onVideoEndEnable = true;	// 是否已回掉过

		this.videoPlayEnd = true;
		let state = this.state;
		state.isShowBigPlay = true;
		state.isUserPause = state.isShowBigPlay;
		state.sliderValue = 0;
		this.setState(state);

		this._videoPlayView.seekToTime(0);
		this.timer = setTimeout(
			() => {
				if (this.props.onVideoEnd && this.callbackEnable === true) {
					this.props.onVideoEnd();
					this.onVideoEndEnable = false;
				}
			},
			300
		);
	};

	_timeShowFormatter = (seconds) => {
		let second = Math.round(seconds % 60);
		if (second < 10) {
			second = '0' + second;
		}
		let minute = Math.floor(seconds / 60);
		if (minute < 10) {
			minute = '0' + minute;
		}
		return minute + ':' + second;
	}

	componentWillReceiveProps() {
		this.state.viewAppear = this.props.videoInfo.isPlaying;
		if (this.videoPlayEnd === true) {
			this.setState({
				isShowBigPlay: !this.props.videoInfo.isPlaying,
				isUserPause: !this.props.videoInfo.isPlaying
			});
		}
	}

	componentDidMount() {
		if (this.props.videoInfo.id !== '') {
			let id = this.props.videoInfo.id;
			umengTrack('视频详情': { '视频': id });
		}
		this._updateVideoPlayView();
		this.subscription = DeviceEventEmitter.addListener('onNavigationStateChange', (events) => {
			let { currentScreen, prevScreen } = events;
			let viewAppear;
			if (currentScreen === 'VideoDetail' && currentScreen === prevScreen) {
				viewAppear = true;
				if (Platform.OS === 'android') {
					KeyboardModule.changeKeyboardMode(KeyboardModule.nothing)
				}
			} else {
				viewAppear = false;
				if (Platform.OS === 'android') {
					KeyboardModule.changeKeyboardMode(KeyboardModule.resize)
				}
			}
			if (viewAppear !== this.state.viewAppear) {
				this.setState({
					viewAppear: viewAppear
				});
			}
		})
	}

	componentDidUpdate() {
		this._updateVideoPlayView();
	}

	componentWillUnmount() {
		this.subscription.remove();
		this.timer && clearTimeout(this.timer);
	}

	_updateVideoPlayView = () => {
		if (this._videoPlayView) {
			if (this.props.videoInfo.isPlaying === true && this.state.isUserPause === false && this.state.viewAppear === true) {
				this._videoPlayView.start();
			} else {
				this._videoPlayView.pause();
			}
		}
	}

	_onValueChange = (value) => {
		// 拖动滑块时，暂停播放
		this._videoPlayView.pause();
		if (this.props.onscrollEnabled) {
			this.props.onscrollEnabled(false);
		}
	}

	_onSlidingComplete = (value) => {
		let currentTime = value * this.state.duration;
		let time = value * this.state.duration * 1000;
		this._videoPlayView.seekToTime(time);
		if (this.props.onscrollEnabled) {
			this.props.onscrollEnabled(true);
		}
	}

	_playerControl = () => {
		if (this.state.isShowBigPlay === true) {
			return <Image source={bigPlay} style={styles.bigPlay} />;
		}
	}

	_showThumbnail = () => {
		if (this.state.isShowThumbnail === true) {
			return <Image style={styles.backgroundImage}
				source={{ uri: this.props.videoInfo.videoThumbnailUrl }}
				defaultSource={detailVideoThumbnail}
				autoCalcSize={false}
			/>
		}
	}

	_showSliderThumbImage = () => {
		// if (this.state.sliderDisabled === true) {
		// 	return sliderThumbnailNone
		// } else {
		return sliderThumbnail
		// }
	}

	_showPlayerCurrentTime = () => {
		if (this.state.sliderDisabled === false) {
			let textStyle = null;
			if (Platform.OS === 'ios') {
				textStyle = { marginRight: transformSize(20) };
			}
			return <Text style={[styles.sliderText, textStyle]}> {this._timeShowFormatter(this.state.currentTime)} </Text >;
		}
	}

	_showPlayerDuration = () => {
		if (this.state.sliderDisabled === false) {
			let textStyle = null;
			if (Platform.OS === 'ios') {
				textStyle = { marginLeft: transformSize(20) };
			}
			return <Text style={[styles.sliderText, textStyle]}> {this._timeShowFormatter(this.state.duration)} </Text>;
		}
	}

	_onPressPlayer = () => {
		let state = this.state;
		if (this.state.loading === true) {
			this.setState({
				isShowBigPlay: false
			})
			return;
		}
		state.isShowBigPlay = !state.isShowBigPlay;
		state.isUserPause = state.isShowBigPlay;
		this.setState(state);
		// alert(JSON.stringify(this.state));
	}

	_onPlayError = () => {
		let state = this.state;
		state.loading = false;
		this.setState(state);

		Toast.show('视频加载失败');
	}

	_onPressUser = () => {
		if (this.props.videoInfo.author) {
			this.props.navigation.navigate('Profile', {
				id: this.props.videoInfo.author.id,
				type: this.props.videoInfo.author.type
			});
		}
	}

	_operationStar = async () => {
		if (this.props.videoInfo.network === 'none' || this.props.videoInfo.network === 'unknown') {
			return;
		}
		if (this.operationStar === true) {
			return;
		}
		this.operationStar = true;
		let isLike = !this.props.videoInfo.behavior.likeFlag;
		let count = isLike ? 1 : -1;
		await like(isLike, '1002', Number(this.props.videoInfo.id));
		if (this.props.onVideoStar) {
			this.props.onVideoStar(this.props.videoInfo.id, isLike, this.props.videoInfo.behavior.likeCount + count);
		}
		this.operationStar = false;
	}

	_operationComment = () => {
		if (this.props.videoInfo.network === 'none' || this.props.videoInfo.network === 'unknown') {
			return;
		}
		if (this._commentModal) {
			// 评论数据的向上回调
			this.callbackEnable = false;
			this._commentModal.open();
		}
	}

	_updateCommentTotal = (count) => {
		// 评论数
		if (this.props.onVideoComment) {
			this.props.onVideoComment(this.props.videoInfo.id, count);
		}
	}

	_onCloseComment = () => {
		this.callbackEnable = true;
		// 当前为暂停状态，则通知主屏视频播放结束
		if (this.videoPlayEnd === true) {
			this._onVideoEnd();
			this.videoPlayEnd = false;
		}
	}

	_operationCollect = async () => {
		if (this.props.videoInfo.network === 'none' || this.props.videoInfo.network === 'unknown') {
			return;
		}
		if (this.operationCollect === true) {
			return;
		}
		this.operationCollect = true;
		let isCollect = !this.props.videoInfo.behavior.favoriteFlag;
		let count = isCollect ? 1 : -1;
		await collect(isCollect, '1002', Number(this.props.videoInfo.id));
		if (this.props.onVideoCollect) {
			this.props.onVideoCollect(this.props.videoInfo.id, isCollect, this.props.videoInfo.behavior.favoriteCount + count);
		}
		this.operationCollect = false;
		DeviceEventEmitter.emit('CancelCollection');
	}

	_operationShare = async () => {
		this.callbackEnable = false;
		let data = {
			title: `【悠然一指】${this.props.videoInfo.title}`,
			content: '发现应用里面有趣有料又好玩的信息',
			url: `${env.webBaseUrl}/video/${this.props.videoInfo.id}`,
			imgUrl: this.props.videoInfo.videoThumbnailUrl,
			callback: this._shareCallback
		}
		let component = (<Share  {...this.props} data={data} dark />)
		modal.show(component, 'share');
		this.setState({
			viewAppear: false
		});
	}

	_shareCallback = async (result) => {
		this.setState({
			viewAppear: true
		});
		if (result) {
			// 分享成功回调
			this.callbackEnable = true;
			// 分享成功调接口
			await share('1002', Number(this.props.videoInfo.id));
			if (this.props.onVideoShare) {
				this.props.onVideoShare(this.props.videoInfo.id, this.props.videoInfo.behavior.shareCount + 1);
			}
		}
	}

	// 点赞／评论／收藏／分享
	_onPressUserBehavior = (op, param) => {
		const UserBehaviorMapping = {
			'user': this._onPressUser,
			'star': this._operationStar,
			'comment': this._operationComment,
			'collect': this._operationCollect,
			'share': this._operationShare,
		}
		if (op === 'collect') {
			let { user } = store.getState();
			if (user.isSignIn === false) {
				// 未登录跳转登录页
				this.props.navigation.navigate('LoginScreen');
				return;
			}
		}
		let callFunc = UserBehaviorMapping[op];
		if (callFunc) {
			this.callbackEnable = false;
			callFunc(param);
			this._onPressUserBehaviorEnd(op);
		}
	}

	// 所有操作完成后调此方法，结束callbackEnable
	_onPressUserBehaviorEnd = (op) => {
		if (!(op === 'comment' || op === 'share')) {
			this.callbackEnable = true;
		}
		// 当前为暂停状态，则通知主屏视频播放结束
		if (this.videoPlayEnd === true) {
			this._onVideoEnd();
			this.videoPlayEnd = false;
		}
	}

	_renderComment = () => {
		if (this.props.videoInfo.isPlaying && !this.state.hasRenderComment) {// 正在播放且没有渲染过Comment
			this.setState({ hasRenderComment: true })
		}
		if (this.state.hasRenderComment) {
			return (<VideoCommentModal
				artData={{ id: this.props.videoInfo.id ? this.props.videoInfo.id : '' }}
				updateCommentTotal={(count) => { this._updateCommentTotal(count) }}
				onClose={this._onCloseComment}
				ref={(ref) => this._commentModal = ref} />)
		} else {
			return (<View style={{ width: '100%', height: 0 }} />)
		}
	}

	_renderActivityIndicator = () => {
		if (this.state.loading === true) {
			return <ActivityIndicator style={styles.activityIndicator} animating={true} color={'#ffffff'} size='large' />
		}
	}

	_renderVideoPlayer = () => {
		if (this.props.videoInfo.videoUrl !== '') {
			return <VideoPlayView
				ref={ref => { this._videoPlayView = ref; }}
				style={styles.videoPlay}
				source={{ uri: this.props.videoInfo.videoUrl }}
				onVideoLoad={this._onVideoLoad}
				onVideoProgress={this._onVideoProgress}
				onVideoLoadEnd={this._onVideoLoadEnd}
				onPlayEnd={this._onVideoEnd}
			/>
		}
	}

	_renderUserHeadImg = () => {
		if (this.props.videoInfo.author && this.props.videoInfo.author.headImg && this.props.videoInfo.author.headImg !== '') {
			return (
				<View style={styles.userImageWrap}>
					<Image style={styles.userImage} source={{ uri: this.props.videoInfo.author.headImg }} defaultSource={require('@assets/images/nologin-user.png')} />
				</View>);
		} else {
			return (
				<View style={styles.userImageWrap}>
					<Image style={styles.userImage} source={require('@assets/images/nologin-user.png')} />
				</View>
			);
		}
	}

	_renderSlider = () => {
		let showThumbnail = this.props.videoInfo.videoDuration > PlayerControlCriticalValue;
		if (showThumbnail) {
			return <Slider
				minimumTrackTintColor={'rgba(136, 136, 136, 0.8)'}
				maximumTrackTintColor={'rgba(0, 0, 0, 0.8)'}
				thumbTintColor={'#CCC'}
				style={styles.slider}
				thumbImage={sliderThumbnail}
				value={this.state.sliderValue}
				disabled={this.state.showThumbnail}

				onValueChange={this._onValueChange}
				onSlidingComplete={this._onSlidingComplete}
			/>
		} else {
			return <MySlider
				showThumbnail={false}
				style={styles.slider}
				thumbImage={sliderThumbnailNone}
				disabled={true}
				value={this.state.sliderValue}
				thumbTintColor={'transparent'}
			/>
		}
	}

	render() {
		let bottomStyle = null;
		if (isIphoneX() === true) {
			bottomStyle = { marginBottom: 34 };
		}
		return (
			<View style={styles.container}>
				{/* 视频播放器 */}
				{this._renderVideoPlayer()}
				<TouchableOpacity style={styles.bigPlayContainer} onPress={this._onPressPlayer} activeOpacity={1}>
					{this._showThumbnail()}
					{this._playerControl()}
				</TouchableOpacity>
				{this._renderActivityIndicator()}
				<View style={[styles.videoInfo, bottomStyle]}>
					{/* 视频信息 */}
					<ImageBackground style={styles.videoBackgroundImage} source={homeVideoOpacity}>
						<View style={{ flex: 1, justifyContent: 'flex-end' }}>
							<Text style={[styles.videoTitle, styles.shadow]}>@ {this.props.videoInfo.author ? this.props.videoInfo.author.nickName : ''}</Text>
							<Text style={[styles.videoContent, styles.shadow]}>{this.props.videoInfo.title}</Text>
						</View>
						<View style={{ width: '100%', height: transformSize(100), justifyContent: 'flex-end' }}>
							<View style={styles.videoPlayControl}>
								{this._showPlayerCurrentTime()}
								{this._renderSlider()}
								{this._showPlayerDuration()}
							</View>
						</View>
					</ImageBackground>
				</View>

				<View style={styles.interaction}>
					{/* 边栏 */}
					<TouchableOpacity onPress={this._onPressUser} activeOpacity={1}>
						{this._renderUserHeadImg()}
					</TouchableOpacity>
					<View style={styles.behaviorIconContainer} >
						<VideoDetailBehaviorIcon
							style={[styles.behaviorIcon, styles.shadow]}
							number={transformNum(this.props.videoInfo.behavior ? this.props.videoInfo.behavior.likeCount : 0)}
							image={(this.props.videoInfo.behavior && this.props.videoInfo.behavior.likeFlag > 0) ? detailStar : detailUnstar}
							onPress={() => { this._onPressUserBehavior('star'); }} />
						<VideoDetailBehaviorIcon
							style={[styles.behaviorIcon, styles.shadow]}
							number={transformNum(this.props.videoInfo.behavior ? this.props.videoInfo.behavior.commentCount : 0)}
							image={detailComment}
							onPress={() => { this._onPressUserBehavior('comment'); }} />
						<VideoDetailBehaviorIcon
							style={[styles.behaviorIcon, styles.shadow]}
							number={transformNum(this.props.videoInfo.behavior ? this.props.videoInfo.behavior.favoriteCount : 0)}
							image={(this.props.videoInfo.behavior && this.props.videoInfo.behavior.favoriteFlag > 0) ? detailCollect : detailUncollect}
							onPress={() => { this._onPressUserBehavior('collect'); }} />
						<VideoDetailBehaviorIcon
							style={[styles.behaviorIcon, styles.shadow]}
							number={transformNum(this.props.videoInfo.behavior ? this.props.videoInfo.behavior.shareCount : 0)} image={detailForward}
							onPress={() => { this._onPressUserBehavior('share'); }} />
					</View>
				</View>
				{this._renderComment()}
			</View >
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#000',
		justifyContent: 'flex-end',
		width: SCREEN_WIDTH,
		height: '100%'
	},

	videoPlay: {
		position: 'absolute',
		backgroundColor: 'transparent',
		width: '100%',
		height: '100%'
	},

	backgroundImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
	},

	bigPlayContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},

	activityIndicator: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		marginLeft: transformSize(-18),
		marginTop: transformSize(-18),
	},

	bigPlay: {
		position: 'absolute',
		backgroundColor: 'transparent',
		width: transformSize(130),
		height: transformSize(150),
		left: '50%',
		top: '50%',
		marginLeft: transformSize(-65),
		marginTop: transformSize(-75)
	},

	videoInfo: {
		height: transformSize(340),
		marginLeft: 0,
		marginRight: 0,
	},

	videoBackgroundImage: {
		justifyContent: 'space-between',
		flex: 1
	},

	videoTitle: {
		color: '#ffffff',
		fontSize: transformSize(32),
		marginRight: transformSize(150),
		marginLeft: transformSize(30)
	},

	videoContent: {
		color: '#ffffff',
		fontSize: transformSize(28),
		marginTop: transformSize(40),
		marginBottom: 0,
		lineHeight: transformSize(40),
		marginRight: transformSize(150),
		marginLeft: transformSize(30)
	},

	videoPlayControl: {
		height: transformSize(80),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginLeft: transformSize(30),
		marginRight: transformSize(30)
	},

	sliderLeftContainer: {
		marginRight: transformSize(20),
		justifyContent: 'center'
	},

	sliderText: {
		color: '#888888',
		fontSize: transformSize(26),
		width: transformSize(80),
		height: transformSize(30),
		textAlign: 'center',
		padding: 0,
		includeFontPadding: false
	},

	sliderRightContainer: {
		marginLeft: transformSize(20),
	},

	slider: {
		flex: 1,
	},

	interaction: {
		position: 'absolute',
		top: transformSize(392),
		right: transformSize(8),
		// backgroundColor: '#222222',
		width: transformSize(110),
		height: transformSize(760),
		alignItems: 'center',
		// justifyContent: 'space-between'
	},
	userImageWrap: {
		width: transformSize(110),
		height: transformSize(110),
		borderRadius: transformSize(55),
		borderWidth: transformSize(3),
		borderColor: '#ffffff',
		overflow: 'hidden',
	},

	userImage: {
		width: transformSize(110),
		height: transformSize(110),
		borderRadius: transformSize(55),
		backgroundColor: 'transparent',
		overlayColor: 'transparent',
	},

	behaviorIconContainer: {
		marginTop: transformSize(94),
		flex: 1,
		justifyContent: 'space-between'
	},

	behaviorIcon: {
		alignItems: 'center',
		// marginBottom: transformSize(58),
	},

	icon: {
		// backgroundColor: '#f0f0f0',
		width: transformSize(64),
		height: transformSize(64)
	},

	number: {
		color: '#ffffff',
		fontSize: transformSize(26),
		marginTop: transformSize(16)
	},

	shadow: {
		shadowColor: '#E5E5E5',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowOpacity: 0.2,
		shadowRadius: 3,
		// elevation: 3,
	},
});