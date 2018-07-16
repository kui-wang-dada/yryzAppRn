import React, { Component } from 'react';
import { PropTypes } from 'prop-types'
import {
	View,
	StyleSheet,
	ImageBackground,
	Text,
	TouchableOpacity,
	ActivityIndicator,
	Slider
} from 'react-native';

import { VideoPlayView } from 'ydk-react-native'
import { transformSize, isIphoneX } from '@utils'
import { Image } from '@components'

import {
	bigPlay,
	sliderThumbnail,
	detailVideoThumbnail,
	recordNavigationBack,
	videoPlayerMask
} from './assets'

import Toast from '../../components/Toast'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@utils/commonStyle';

export default class VideoScreen extends React.Component {

	// static defaultProps = {
	// 	uri: 'https://cdn.yryz.com/yryz-new/video/4c54f23a-ee5e-4940-b816-aced7e19ba7c.mp4',
	// 	thumbnailUri: 'https://cdn.yryz.com/yryz-new/image/3C2E31BF-C7E0-4DB8-A225-0420DF37A642.jpg'
	// };

	static propTypes = {
		...View.propTypes,
		uri: PropTypes.string,			// 视频url
		thumbnailUri: PropTypes.string, // 视频缩略图url
		onClose: PropTypes.func,
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
			loading: false
		};
	}

	// onVideoLoad
	_onVideoLoad = () => {
		// alert('aaa');
		this.setState({
			loading: true,
			isShowThumbnail: false
		});
	};

	_onVideoLoadEnd = () => {
		let state = this.state;
		state.loading = false;
		this.setState(state);
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
		this.setState(state);
	};

	_onVideoEnd = () => {
		this.videoPlayEnd = true;
		let state = this.state;
		state.isShowBigPlay = true;
		state.isUserPause = state.isShowBigPlay;
		state.sliderValue = 0;
		this.setState(state);

		this._videoPlayView.seekToTime(0);
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

	componentDidMount() {
		this._updateVideoPlayView();
	}

	componentDidUpdate() {
		this._updateVideoPlayView();
	}

	_updateVideoPlayView = () => {
		if (this._videoPlayView) {
			if (this.state.isUserPause === false) {
				this._videoPlayView.start();
			} else {
				this._videoPlayView.pause();
			}
		}
	}

	_onValueChange = (value) => {
		let state = this.state;
		let currentTime = value * state.duration;
		state.currentTime = currentTime;
		state.isUserPause = true;
		state.sliderValue = value;
		this.setState(state)

		// 拖动滑块时，暂停播放
		this._videoPlayView.pause();
	}

	_onSlidingComplete = (value) => {

		let state = this.state;
		state.isUserPause = this.state.isShowBigPlay;
		this.setState(state)

		let time = value * this.state.duration * 1000;
		// 播动结束时，开始播放
		this._videoPlayView.seekToTime(time);
		// this._videoPlayView.start();
		if (this.props.onscrollEnabled) {
			this.props.onscrollEnabled(true);
		}
	}

	_playerControl = () => {
		if (this.state.isShowBigPlay === true) {
			return <Image style={styles.bigPlay} source={bigPlay} />;
		}
	}

	_showThumbnail = () => {
		if (this.state.isShowThumbnail) {
			return <Image style={styles.backgroundImage}
				source={{ uri: this.props.navigation.state.params.thumbnailUri }}
				defaultSource={detailVideoThumbnail}
				autoCalcSize={false}
			/>
		}
	}

	_showPlayerCurrentTime = () => {
		return <Text style={[styles.sliderText, styles.sliderLeftContainer]}> {this._timeShowFormatter(this.state.currentTime)} </Text>
	}

	_showPlayerDuration = () => {
		return <Text style={[styles.sliderText, styles.sliderRightContainer]}> {this._timeShowFormatter(this.state.duration)} </Text>
	}

	_onClose = () => {
		// if (this.props.onClose) {
		// 	this.props.onClose();
		// }
		this.props.navigation.goBack()
	}

	_onPressPlayer = () => {
		let state = this.state;
		if (state.loading === true) {
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

	_renderActivityIndicator = () => {
		if (this.state.loading === true) {
			return <ActivityIndicator style={styles.activityIndicator} animating={true} color={'#ffffff'} size='large' />
		}
	}

	_renderVideoPlayer = () => {
		if (this.props.uri !== '') {
			return <VideoPlayView
				ref={ref => { this._videoPlayView = ref; }}
				style={styles.videoPlay}
				source={{ uri: this.props.navigation.state.params.uri }}
				onVideoLoad={this._onVideoLoad}
				onVideoProgress={this._onVideoProgress}
				onVideoLoadEnd={this._onVideoLoadEnd}
				onPlayEnd={this._onVideoEnd}
			/>;
		}
	}

	_renderSlider = () => {
		return <Slider
			minimumTrackTintColor={'#888'}
			maximumTrackTintColor={'#000'}
			thumbTintColor={'#CCC'}
			style={styles.slider}
			thumbImage={sliderThumbnail}
			value={this.state.sliderValue}
			onValueChange={this._onValueChange}
			onSlidingComplete={this._onSlidingComplete}
		/>
	}

	render() {
		let topStyle = null;
		let bottomStyle = null;
		if (isIphoneX() === true) {
			topStyle = { top: transformSize(80) };
			bottomStyle = { height: transformSize(100) + 34 };
		}
		return (
			<View style={styles.container}>
				{/* 视频播放器 */}
				{this._renderVideoPlayer()}

				<TouchableOpacity style={styles.bigPlayContainer} onPress={this._onPressPlayer} activeOpacity={1}>
					{this._showThumbnail()}
					{this._playerControl()}
				</TouchableOpacity>

				{/* 导航栏 */}
				<View style={[styles.navigation, topStyle]}>
					<TouchableOpacity style={styles.navigationBack} onPress={this._onClose}>
						<Image style={{ width: 30, height: 30, backgroundColor: 'transparent' }} source={recordNavigationBack} />
					</TouchableOpacity>
				</View>
				{this._renderActivityIndicator()}

				{/* 视频控制区域 */}
				<View style={[styles.videoPlayControlContainer, bottomStyle]}>
					<ImageBackground style={styles.videoBackgroundImage} source={videoPlayerMask}>
						<View style={styles.videoPlayControl}>
							{this._showPlayerCurrentTime()}
							{this._renderSlider()}
							{this._showPlayerDuration()}
						</View>
					</ImageBackground>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
		justifyContent: 'flex-end',
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

	videoPlay: {
		position: 'absolute',
		backgroundColor: 'transparent',
		width: '100%',
		height: '100%'
	},

	backgroundImage: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT
	},

	bigPlayContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
	},

	activityIndicator: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		marginLeft: transformSize(-18),
		marginTop: transformSize(-18),
		// backgroundColor: '#000000',
		// borderRadius: 3
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

	videoPlayControlContainer: {
		bottom: 0,
		height: transformSize(100),
		justifyContent: 'flex-start'
	},

	videoBackgroundImage: {
		flex: 1
		// justifyContent: 'flex-start'
	},

	videoPlayControl: {
		height: transformSize(100),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginLeft: transformSize(30),
		marginRight: transformSize(30),
	},

	sliderLeftContainer: {
		marginRight: transformSize(20),
		alignItems: 'center',
	},

	sliderText: {
		color: '#888888',
		fontSize: transformSize(26),
	},

	sliderRightContainer: {
		marginLeft: transformSize(20),
	},

	slider: {
		flex: 1,
	},
});