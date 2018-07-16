import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Animated
} from 'react-native';
import {
	SafeAreaView
} from 'react-navigation'

import { VideoPlayView } from 'ydk-react-native'
import { VideoRecordView } from 'ydk-react-native'
import { PropTypes } from 'prop-types'
import { transformSize, commonStyle } from '@utils'

import Slider from './components/Slider'

import { recordNavigationBack, sliderThumbnailNone, recordFinish, recordUndo } from './assets'
import { Icon, Toast } from '@components'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@utils/commonStyle';

const RecordMaximumDuration = 15; 	// 最大时长
const RecordMinimumDuration = 3; 	// 最小时长
export default class RecordScreen extends React.Component {

	static defaultProps = {
		type: 1,
	};

	static propTypes = {
		...View.propTypes,
		type: PropTypes.number,			// 0 拍照  1 拍摄
		onRecordEnd: PropTypes.func,	// 完成回调 { type: 0/1, result: uri: ... / videoInfo: ... }
		onClose: PropTypes.func,		// 关闭
	};

	constructor(props) {
		super(props);
		this.state = {
			borderWidth: new Animated.Value(8),
			progress: 0,   // 0 ~ 1
			startRecord: false,		// 是否开始摄像
			recordFinish: false,	// 是否完成
			loading: false,
		};
		this.time = 0;

		this.imgPath = '';	// 拍照图片地址
		this.videoInfo = null;	// 拍摄视频信息
	}

	onTakePhotoResult = (e) => {
		this.takePhotoFlag = false;
		let { imgPath } = e.nativeEvent;
		alert(imgPath)
		this.imgPath = imgPath;
		this.setState({
			recordFinish: true
		})
	}

	onRecordVideoResult = (e) => {
		this.stopInterval();
		// TODO: 隐藏加载
		this.setState({
			loading: false
		})
		let { video } = e.nativeEvent;
		this.videoInfo = { ...video }
		this.setState({
			recordFinish: true
		})
	}

	onRecordError = (e) => {
		let { code, errorCode } = e.nativeEvent;
		code = code ? Math.abs(code) : Math.abs(errorCode);
		let codeTable = {
			1001: '无摄像头权限',
			1003: '无麦克风',
			1007: '无录像权限',
			1008: '无拍照权限',
			1009: '录像失败',
			1010: '拍照失败'
		}
		let msg = codeTable[code];
		Toast.show(msg);
		// 拍摄失败
		this.stopInterval();
		this.setState({
			startRecord: false,
		})
		if (!(code === 1009 || code === 1010)) {
			this.props.navigation.pop();
		}
	}

	cancel = () => {
		this.props.navigation.pop();
	};

	// 完成拍照／拍摄
	_onRecordFinish = () => {
		// 回调
		if (this.props.navigation.state.params.onRecordEnd) {
			// { type: 0/1, result: uri: ... / videoInfo: ... }
			let type = this.props.navigation.state.params.type;
			let result = type === 0 ? { uri: this.imgPath } : { videoInfo: this.videoInfo };
			this._onClose();
			this.props.navigation.state.params.onRecordEnd({ type, result });
		}
	}

	_onRecordCancel = () => {
		this.imgPath = '';
		this.videoInfo = null;
		this.setState({
			recordFinish: false
		})
	}

	startRecord = () => {
		this.startInterval();
		this._recordView.startRecord();
		this.setState({
			startRecord: true
		})
	};

	stopRecord = () => {
		if (this.time / 10 < RecordMinimumDuration) {
			return;
		}
		// TODO: 开始加载
		this.stopInterval();
		this._recordView.stopRecord();
		this.setState({
			startRecord: false,
			loading: true
		})
	};

	changeCamera = () => {
		this._recordView.changeCamera();
	};

	_takePhoto = () => {
		if (this.takePhotoFlag) {
			return;
		}
		this.takePhotoFlag = true;
		this._recordView.takePhoto();
	};

	_onPress = () => {
		if (this.props.navigation.state.params.type === 0) {
			this._takePhoto();
		} else {
			if (this.state.loading) {
				return;
			}
			if (this.state.startRecord) {
				this.stopRecord();
			} else {
				this.startRecord();
				this._changeBorderWidth(16)
			}
		}
	}

	_onPressOut = () => {
		if (this.props.navigation.state.params.type === 1) {
			return;
		}
		if (this.state.loading || this.state.startRecord) {
			return;
		}
		Animated.timing(this.state.borderWidth, { toValue: 8 }).start(() => {

		});
	}

	_onPressIn = () => {
		if (this.props.navigation.state.params.type === 1) {
			return;
		}
		if (this.state.loading || this.state.startRecord) {
			return;
		}
		Animated.timing(this.state.borderWidth, { toValue: 16 }).start(() => {

		});
	}

	startInterval = () => {
		this.startRecordInterval();
	}

	startRecordInterval = () => {
		this.time = 0;
		this.recordInterval = setInterval(() => {
			this.time += 1;
			this.setState({
				progress: this.time / 10 / RecordMaximumDuration
			});
			if (this.time / 10 > RecordMaximumDuration) {
				this.stopRecord();
				this.time = 0;
			}
		}, 100);
	}

	startProgressInterval = () => {

	}

	stopInterval = () => {
		this.setState({
			progress: 0.0
		});
		this.recordInterval && clearInterval(this.recordInterval);
		this.recordInterval = null;
	}

	_changeBorderWidth = (width) => {
		width = width === 16 ? 8 : 16;
		Animated.timing(this.state.borderWidth, { toValue: width }).start(() => {
			if (this.state.startRecord) {
				this._changeBorderWidth(width);
			} else {
				Animated.timing(this.state.borderWidth, { toValue: 8 }).start();
			}
		});
	}

	_onClose = () => {
		this.props.navigation.pop();
		if (this.props.navigation.state.params.onClose) {
			this.props.navigation.state.params.onClose();
		}
	}

	_onVideoEnd = () => {
		this._videoPlayView.seekToTime(0);
		this._videoPlayView.start();
	}

	_renderRecordMaxText = () => {
		if (this.props.navigation.state.params.type === 1) {
			return <Text style={styles.recordMaxText}>最多可拍摄15s</Text>;
		}
	}

	_renderRecordStop = () => {
		if (this.state.startRecord) {
			return <View style={styles.recordStopView} />;
		}
	}

	_renderRecordButtonTitle = () => {
		if (this.props.navigation.state.params.type === 0) {
			return '点击拍照';
		} else {
			return this.state.startRecord ? '点击停止' : '点击拍摄';
		}
	}

	_renderSliderContainer = () => {
		if (this.props.navigation.state.params.type === 1) {
			return <View style={styles.sliderContainer}>
				<Slider
					showThumbnail={true}
					thumbTintColor={'transparent'}
					style={styles.slider}
					minimumTrackTintColor={commonStyle.color_theme}
					disabled={true}
					thumbImage={sliderThumbnailNone}
					value={this.state.progress}
				/>
				<View style={styles.sliderMinimumView} />
				<View style={styles.recordMinContainer}>
					<Icon name={'pull-up'}
						color={commonStyle.color_theme}
						size={transformSize(12)}
					// style={styles.recordMinTriangle}
					/>
					<View style={styles.recordMinTextContainer}>
						<Text style={styles.recordMinText}>至少拍摄3s</Text>
					</View>
				</View>
			</View>
		}
	}

	_renderActivityIndicator = () => {
		if (this.state.loading === true) {
			return <ActivityIndicator style={styles.activityIndicator} animating={true} color={'#ffffff'} size='large' />
		}
	}

	_renderRecordPreview = () => {
		if (this.state.recordFinish) {
			return <View style={styles.recordRecordPreviewContainer}>
				{this._renderPreview()}
				<View style={styles.recordPreviewSelectedContainer}>
					<TouchableOpacity style={styles.recordPreviewUndo} onPress={this._onRecordCancel} activeOpacity={1}>
						<Image style={styles.recordPreviewUndo} source={recordUndo} resizeMode={Image.resizeMode.contain} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.recordPreviewFinish} onPress={this._onRecordFinish} activeOpacity={1}>
						<Image style={styles.recordPreviewFinish} source={recordFinish} resizeMode={Image.resizeMode.contain} />
					</TouchableOpacity>
				</View>
			</View>
		}
	}

	_renderPreview = () => {
		if (this.props.navigation.state.params.type === 0) {
			return this._renderPhoto();
		} else {
			return this._renderVideo();
		}
	}

	_renderPhoto = () => {
		return <Image style={{ position: 'absolute', width: '100%', height: '100%' }} source={{ uri: 'file://' + this.imgPath }} />
	}

	_renderVideo = () => {
		return <VideoPlayView
			ref={ref => { this._videoPlayView = ref; }}
			style={{ position: 'absolute', width: '100%', height: '100%' }}
			source={{ uri: 'file://' + this.videoInfo.filePath }}
			onPlayEnd={this._onVideoEnd}
		/>
	}

	render() {
		var mainStyles = styles;
		let borderStyle = { borderWidth: this.state.borderWidth }
		if (this.props.navigation.state.params.type === 1 && this.state.startRecord) {
			// 视频录制中
			borderStyle = { ...borderStyle, backgroundColor: 'rgba(227, 227, 227, 0.8)', borderColor: 'rgba(255, 255, 255, 1.0)' }
		}

		return (
			<SafeAreaView style={styles.container}>
				{/* 摄像头 */}
				<VideoRecordView
					config={{
						maxDuration: RecordMaximumDuration,
						minDuration: RecordMinimumDuration,
						type: this.props.navigation.state.params.type === 0 ? 'photo' : 'record'
					}}
					ref={ref => { this._recordView = ref; }}
					style={styles.recordView}

					onTakePhotoResult={this.onTakePhotoResult}
					onRecordResult={this.onRecordVideoResult}
					onRecordError={this.onRecordError}
				/>

				{/* 导航栏 */}
				<View style={styles.navigation}>
					<View style={styles.navigationBack}>
						<TouchableOpacity onPress={this._onClose} activeOpacity={1}>
							<Image source={recordNavigationBack} />
						</TouchableOpacity>
					</View>
				</View>

				{/* 拍照／拍摄 */}
				<View style={styles.recordContainer}>
					{this._renderRecordMaxText()}
					<TouchableOpacity
						activeOpacity={1}
						onPress={this._onPress}
						onPressOut={this._onPressOut}
						onPressIn={this._onPressIn}
					>
						<Animated.View style={[mainStyles.recordButton, borderStyle, { borderWidth: this.state.borderWidth }]}>
							{this._renderRecordStop()}
						</Animated.View>
					</TouchableOpacity>

					<Text style={styles.recordText}>{this._renderRecordButtonTitle()}</Text>
					{/* 进度条 */}
					{this._renderSliderContainer()}
				</View>

				{/* 加载指示器 */}
				{this._renderActivityIndicator()}

				{/*  拍照／视频预览 */}
				{this._renderRecordPreview()}

			</SafeAreaView>
		);
	}

	componentDidUpdate() {
		if (this._videoPlayView) {
			this._videoPlayView.start();
		}
	}

	componentWillUnmount() {
		this.stopInterval();
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#999999',
		justifyContent: 'space-between',
	},

	navigation: {
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

	recordView: {
		position: 'absolute',
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT
	},

	recordContainer: {
		height: transformSize(400),
		alignItems: 'center',
	},

	recordMaxText: {
		color: '#ffffff',
		fontSize: transformSize(28)
	},

	recordButton: {
		marginTop: transformSize(40),
		width: transformSize(134),
		height: transformSize(134),
		borderRadius: transformSize(67),
		borderWidth: transformSize(16),
		borderColor: 'rgba(227, 227, 227, 0.8)',
		backgroundColor: 'rgba(255, 255, 255, 1.0)',
		alignItems: 'center',
		justifyContent: 'center'
	},

	recordStopView: {
		width: transformSize(44),
		height: transformSize(44),
		borderRadius: transformSize(12),
		backgroundColor: '#ffffff'
	},

	recordText: {
		marginTop: transformSize(40),
		color: '#ffffff',
		fontSize: transformSize(32)
	},

	sliderContainer: {
		marginTop: transformSize(44),
		width: '100%'
	},

	slider: {
		height: 4,
		marginLeft: transformSize(30),
		marginRight: transformSize(30)
	},

	sliderMinimumView: {
		backgroundColor: '#ffffff',
		position: 'absolute',
		width: 3,
		height: 4,
		marginLeft: transformSize(30) + transformSize(750 - 30 - 30) * (RecordMinimumDuration / RecordMaximumDuration),
	},

	recordMinContainer: {
		alignItems: 'center',
		width: transformSize(150),
		height: transformSize(54),
		marginLeft: transformSize(30) + transformSize(750 - 30 - 30) * (RecordMinimumDuration / RecordMaximumDuration) + 2 - transformSize(75),
	},

	recordMinTextContainer: {
		marginTop: transformSize(-4),
		width: '100%',
		height: transformSize(42),
		backgroundColor: commonStyle.color_theme,
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center'
	},

	recordMinText: {
		color: '#ffffff',
		fontSize: transformSize(24),
		textAlign: 'center',
	},

	activityIndicator: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		marginLeft: transformSize(-18),
		marginTop: transformSize(-18),
	},

	// 预览容器
	recordRecordPreviewContainer: {
		position: 'absolute',
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		justifyContent: 'flex-end',
	},

	recordPreviewSelectedContainer: {
		paddingHorizontal: transformSize(140),
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: transformSize(198),
		height: transformSize(134)
	},

	recordPreviewUndo: {
		width: transformSize(134),
		height: transformSize(134),
	},

	recordPreviewFinish: {
		width: transformSize(134),
		height: transformSize(134),
	}
});