import React from 'react';
import {
	View,
	Button,
	Image,
	Text,
	TextInput,
	StyleSheet,
	ScrollView,
	Animated,
	Keyboard,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Modal,
	ActivityIndicator
} from 'react-native';
import {
	transformSize,
	commonStyle,
	isIphoneX,
	modal
} from '@utils'
import {
	withNavigation,
	SafeAreaView
} from 'react-navigation';
import {
	Icon,
	Toast,
	ImagePreview,
	ActionSheet
} from '@components'
import {
	YMedia,
	HttpManager,
	VideoTrimView
} from 'ydk-react-native';
import PhotosManage from './components/photosManage'
import {
	releaseResource
} from './request'

import Record from '../../modules/video/RecordScreen'
import Video from '../../modules/video/VideoScreen'
import PhotosSourceView from './components/PhotosSourceView'
import HudView from './components/HudView'


///文本类型
const ContentType = {
	Text: 0,  //文本
	Image: 1, //图片
	Video: 2  //视频
}

let recordType = 0;
let imageIndex = 0;


export default class PublishScreen extends React.Component {

	///导航栏设置
	static navigationOptions = ({ navigation }) => ({
		gesturesEnabled: false,
		headerStyle: {
			backgroundColor: '#fff',
			borderBottomWidth: transformSize(1),
			borderBottomColor: "#e5e5e5",
			elevation: 0
		},
		title: "广场内容发布",
		headerLeft: (
			<TouchableOpacity onPress={() => navigation.state.params.cancel()}>
				<Text style={{ color: 'gray', width: 50, left: 17, fontSize: transformSize(30) }}>取消</Text>
			</TouchableOpacity>
		),
		headerRight: (
			<TouchableOpacity onPress={() => navigation.state.params.release()}>
				<Text style={{ color: commonStyle.color_theme, width: 50, fontSize: transformSize(30) }}>发布</Text>
			</TouchableOpacity>
		),
	})

	constructor(props) {
		super(props);
		this.actionBarMarginBottom = new Animated.Value(transformSize(0));

		this.state = {
			contentType: ContentType.Text,  ///type类型为三种，1位纯文本，2为图片，3为视频
			images: [], //图片数组
			videoInfo: null,
			content: null,
			imagePreViewVisible: false,
			hudVisible: false,
			keyBoardShow: false,
			contentHeight: commonStyle.SCREEN_HEIGHT - transformSize(100) - transformSize(85)
		}

	}
	componentDidMount() {
		this.props.navigation.setParams({
			release: this.release,
			cancel: this.cancel
		});
	}

	componentWillMount() {
		this.keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
		this.keyboardWillChangeFrameListener = Keyboard.addListener('keyboardDidShow', this.keyboardWillChangeFrame);
	}

	componentWillUnmount() {
		this.keyboardWillHideListener.remove();
		this.keyboardWillChangeFrameListener.remove();
	}

	///键盘弹起
	keyboardWillChangeFrame = (event) => {

		this.setState({ keyBoardShow: true })
		const actionBarTop = isIphoneX() ? (event.endCoordinates.height - transformSize(70)) : event.endCoordinates.height;
		this.setState({
			contentHeight: commonStyle.SCREEN_HEIGHT - event.endCoordinates.height - transformSize(120) - transformSize(100)
		})

		if (Platform.OS === 'ios') {
			Animated.timing(this.actionBarMarginBottom, {
				duration: 1,
				toValue: actionBarTop,
			}).start();
		}
	};

	///键盘隐藏
	keyboardWillHide = (event) => {
		this.setState({ keyBoardShow: false })
		this.setState({
			contentHeight: commonStyle.SCREEN_HEIGHT - transformSize(120) - transformSize(100)
		})
		if (Platform.OS === 'ios') {
			Animated.timing(this.actionBarMarginBottom, {
				duration: 1,
				toValue: transformSize(0),
			}).start();
		}
	};

	///取消
	cancel = () => {
		this.setState({ hudVisible: false })
		this.props.navigation.goBack()
	}

	///发布
	release = () => {
		this.dismissKeyboard()  ///关闭键盘
		if (!this.state.content) {
			Toast.show('请输入正文内容');
			return;
		}
		const squareKid = this.props.navigation.state.params.id
		if (this.state.hudVisible) { return }
		this.setState({ hudVisible: true })
		this.uploap(data => {

			// alert(JSON.stringify(data))
			let duration = this.state.duration ? this.state.duration : 0
			if (this.state.contentType !== ContentType.Text) {
				if (!this.state.hudVisible) { return }
			}

			releaseResource(
				this.state.content,
				this.state.contentType,
				data.imageUrls,
				squareKid,
				duration,
				data.videoThumbnailUrl,
				data.videoUrl
			).then(data => {
				this.setState({ hudVisible: false })
				Toast.show('发布成功！');
				this.props.navigation.state.params.callback();
				this.props.navigation.goBack()
			}).catch(error => {
				this.setState({ hudVisible: false })
				Toast.show('发布失败！');
			})
		})

	}


	///文件上传
	uploap = (callback) => {

		let extJson = {
			imageUrls: null,
			videoUrl: null,
			videoThumbnailUrl: null,
		}

		switch (this.state.contentType) {
			case ContentType.Text:
				{
					callback(extJson)
				}
				break;
			case ContentType.Image:
				{
					PhotosManage.uploadDatas(this.state.images, data => {
						extJson.imageUrls = data
						callback(extJson)
					})
				}
				break;
			case ContentType.Video:
				{
					PhotosManage.uploadVideoData(this.state.videoInfo.filePath, data => {
						extJson.videoUrl = data
						if (extJson.videoUrl && extJson.videoThumbnailUrl) {
							callback(extJson)
						}

					})
					PhotosManage.uploadData(this.state.videoInfo.thumbnailPath, data => {
						extJson.videoThumbnailUrl = data
						if (extJson.videoUrl && extJson.videoThumbnailUrl) {
							callback(extJson)
						}
					})
				}
				break;
		}
	}


	///选择图片
	async seletePhotos() {

		if (this.pictureState()) {
			const options = [
				'选择',
				'拍摄',
				'取消'
			]
			if (Platform.OS === 'ios') {
				ActionSheet.show({
					options: options,
					cancelButtonIndex: 2
				}, (index) => {
					this.recordPhotos(index)
				});

			} else {

				let component = (
					<ActionSheet
						cancelButtonIndex
						callback={(index) => {
							this.recordPhotos(index)
						}}
						options={options}
					/>)
				modal.show(component, 'ActionSheet')

			}
		}
	}


	///选择图片
	recordPhotos = (index) => {
		switch (index) {
			case 0:
				{
					let count = 9 - this.state.images.length
					if (count > 0) {
						PhotosManage.seletePhotos(count).then(data => {
							let newData = this.state.images
							if (data.images) {
								newData = newData.concat(data.images);
								this.setState({
									contentType: ContentType.Image,
									images: newData
								})
							}
						})
					}
				}
				break;
			case 1:
				{
					let count = 9 - this.state.images.length
					if (count > 0) {
						recordType = 0;
						this.record()
					}
				}
				break;
			default:
				break;
		}
	}



	///删除图片
	removePic = (index) => {
		this.setState({
			images: this.state.images.filter((_, i) => i !== index)
		})
		if (this.state.images.length === 1) {  ///图片数组情况，contentType回归最原始状态
			this.setState({
				contentType: ContentType.Text,
			})
		}
	}


	///删除视频
	removeVideo() {
		this.setState({
			contentType: ContentType.Text,
			videoInfo: null
		})
	}


	///选择视频
	async seleteVideo() {
		if (this.videoState()) {
			const options = [
				'选择',
				'拍摄',
				'取消'
			]
			if (Platform.OS === 'ios') {
				ActionSheet.show({
					options: options,
					cancelButtonIndex: 2
				}, (index) => {
					this.recordVideo(index)
				});

			} else {

				let component = (
					<ActionSheet
						cancelButtonIndex
						callback={(index) => {
							this.recordVideo(index)
						}}
						options={options}
					/>)
				modal.show(component, 'ActionSheet')

			}
		}
	}


	recordVideo = (index) => {
		switch (index) {
			case 0:
				{
					PhotosManage.seleteVideo().then(data => {
						let videoInfo = data.videos[0]
						this.props.navigation.navigate('VideoTrimScreen', {
							// uri: 'file://' + videoInfo.filePath,
							uri: videoInfo.filePath,
							callback: (data) => {
								this.setState({
									contentType: ContentType.Video,
									videoInfo: data
								})
							}
						})
					})
				}
				break;
			case 1:
				{
					recordType = 1;
					this.record();
				}
				break;
			default:
				break;
		}
	}


	///拍摄modal
	record = () => {
		this.props.navigation.navigate('Record', {
			type: recordType,
			onRecordEnd: (e) => {
				if (recordType === 0) {   ///拍照
					const data = [e.result.uri]
					let newData = this.state.images
					newData = data.concat(newData);
					this.setState({
						recordVisible: false,
						contentType: ContentType.Image,
						images: newData
					})
				} else { ///录制视频
					const { videoInfo } = e.result
					this.setState({
						recordVisible: false,
						contentType: ContentType.Video,
						videoInfo: videoInfo
					})

				}
			}
		})
	}


	playVideo = () => {
		let { filePath, thumbnailPath } = this.state.videoInfo ? this.state.videoInfo : { filePath: '' }
		let uri = 'file://' + filePath
		this.props.navigation.navigate('Video', {
			uri: uri,
			thumbnailUri: thumbnailPath,
		});
	}


	///图片选择状态
	pictureState() {
		if (this.state.images.length === 9) {
			return false
		} else {
			return this.state.contentType === ContentType.Video ? false : true
		}
	}


	///视频选择状态
	videoState() {
		if (this.state.videoInfo) {
			return false
		} else {
			return this.state.contentType === ContentType.Image ? false : true
		}
	}


	///悬浮栏
	actionBar() {
		return (
			<Animated.View
				style={[styles.actionBarStyle, { bottom: this.actionBarMarginBottom }]}
				ref="actionBar">

				<Icon
					onPress={() => { this.seletePhotos() }}
					name='picture'
					size={25}
					color={this.pictureState() ? commonStyle.color_theme : commonStyle.color_button_unableClick}
					style={styles.photoButtonStyle} />
				<Icon
					onPress={() => { this.seleteVideo() }}
					name='video'
					size={25}
					color={this.videoState() ? commonStyle.color_theme : commonStyle.color_button_unableClick}
					style={styles.videoButtonStyle} />
				{
					this.state.keyBoardShow ? <Icon
						onPress={() => { this.dismissKeyboard() }}
						name='keyboard'
						size={25}
						color={commonStyle.color_theme}
						style={styles.keyboardStyle} /> : null
				}



			</Animated.View >
		);
	}


	hudRender() {
		if (this.state.hudVisible) {
			return <HudView />
		} else {
			return null
		}
	}


	///关闭键盘
	dismissKeyboard() {
		Keyboard.dismiss();
		this.refs.input.caretHidden = true;
	}

	///编辑时滑动到最底端
	changeText(text) {
		// this.refs.contentScrollView.scrollToEnd({ animated: true });
	}

	///查看大图
	imagePreview = (index) => {
		var images = this.state.images;
		var uris = []
		images.forEach(
			function (v, i, a) {
				let image = { source: { uri: 'file://' + v } }
				uris.push(image)
			}
		)

		let compenent = (
			<ImagePreview
				imageUrls={uris}
				onClick={(page) => {
					modal.close()
				}}
				initialPage={index}
				onQRResponse={(response) => {

				}}
			/>
		)
		modal.show(compenent)

	}



	render() {
		// alert(this.state.contentHeight)
		const squareTheme = this.props.navigation.state.params.squareTheme ? this.props.navigation.state.params.squareTheme : '广场主题'
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
				<View style={styles.container}>
					<Animated.View style={[
						styles.contentStyle,
						{
							height: this.state.contentHeight
						}
					]}>
						<ScrollView
							ref="contentScrollView"
							onStartShouldSetResponderCapture={true} >
							<TextInput
								ref="input"
								onChangeText={(text) => { this.setState({ content: text }) }}
								onChange={() => { this.changeText(); }}
								onFocus={() => { this.changeText(); }}
								placeholder={squareTheme}
								maxLength={300}
								multiline={true}
								underlineColorAndroid="transparent"
								style={styles.textInputStyle}
							/>
							<PhotosSourceView
								style={{ marginTop: transformSize(20) }}
								data={this.state}
								deleteImageClick={(index) => { this.removePic(index) }}
								imageDidClick={(index) => {
									this.imagePreview(index)
								}}
								videoPlay={() => {
									this.playVideo()
								}}
								videoDelete={() => { this.removeVideo() }}
							/>
						</ScrollView>
					</Animated.View>
					{this.actionBar()}
					<ActionSheet ref={ActionSheet.init} />
				</View>
				{this.hudRender()}

			</SafeAreaView>

		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	contentStyle: {
		marginTop: 0,
		marginLeft: 0,
		marginRight: 0,
		// backgroundColor: 'yellow'
	},
	textInputStyle: {
		padding: 0,
		marginTop: transformSize(15),
		marginLeft: transformSize(30),
		marginRight: transformSize(30),
		marginBottom: transformSize(20),
		fontSize: commonStyle.fontSize_login_30,
		textAlignVertical: 'top',
		minHeight: transformSize(120),
	},
	actionBarStyle: {
		zIndex: 1000,
		position: 'absolute',
		flexDirection: 'row',
		bottom: 0,
		height: transformSize(88),
		right: 0,
		left: 0,
		borderTopWidth: transformSize(0.5),
		borderTopColor: commonStyle.color_border_1,
		backgroundColor: 'white'
	},
	photoButtonStyle: {
		marginLeft: transformSize(50),
		marginTop: transformSize(20),
		height: transformSize(65),
		width: transformSize(65),
	},
	videoButtonStyle: {
		marginLeft: transformSize(50),
		marginTop: transformSize(20),
		height: transformSize(65),
		width: transformSize(65),
	},
	lookPeopleWriteStyle: {
		marginLeft: transformSize(50),
		marginTop: transformSize(30),
		height: transformSize(30),
		color: commonStyle.color_theme,
		fontSize: transformSize(24),
	},
	keyboardStyle: {
		marginTop: transformSize(20),
		marginRight: 100,
		marginLeft: transformSize(450),
		height: transformSize(65),
		width: transformSize(65),
	},


});
