import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	ActivityIndicator,
	CameraRoll,
	StyleSheet,
	Dimensions,
	TouchableHighlight,
	NativeModules,
	Platform,
	Image as DefaultImage
} from 'react-native';
import Gallery from 'react-native-image-gallery';
import PropTypes from 'prop-types';
import { ToastView, Image } from '@components';
import { isIphoneX } from '@utils'
import { Media, HttpManager } from 'ydk-react-native';
import { transformSize,commonStyle } from '@utils';

const winWidth = Dimensions.get('window').width;
const winHeight = Dimensions.get('window').height;
const menuHeight = 110;

export default class ImagePreview extends Component {

	static propTypes = {
		...View.propTypes,
		initialPage: PropTypes.number,
		imageUrls: PropTypes.arrayOf(PropTypes.object), // 图片数据
		onClick: PropTypes.func, // 点击页面方法
		checkQRCode: PropTypes.bool,//是否需要扫描二维码功能
		onQRResponse: PropTypes.func // 扫描二维码完成方法，会返回扫描结果
	}

	static defaultProps = {
		initialPage: 0,
		checkQRCode: false,
	}

	constructor(props) {
		super(props);
		this.state = {
			images: this.props.imageUrls,
			hasQRCode: true,
			QRResponse: "",
			menuVisible: false,
			checkQRCode: this.props.checkQRCode,
			index: 0,
			showLoading: false,
		};
		this.onChangeImage = this.onChangeImage.bind(this);
	}

	getMenuHeight() {
		let iphoneXHeiht = isIphoneX() ? 60 : 0;
		return (this.state.hasQRCode ? (170 + iphoneXHeiht) : (110 + iphoneXHeiht));
	}

	/*
    设置图片
     */
	addImages() {
		// Debugging helper : keep adding images at the end of the gallery.
		setInterval(() => {
			const newArray = [
				...this.state.images, {
					source: {
						uri: 'http://i.imgur.com/DYjAHAf.jpg'
					}
				}
			];
			this.setState({ images: newArray });
		}, 5000);
	}

	/**
     * 移除指定位置的图片
     * @param  {[type]} slideIndex 图片index
     * @param  {[type]} delay      需要延后操作的事件
     */
	removeImage(slideIndex, delay) {
		// Debugging helper : remove a given image after some delay.
		// Ensure the gallery doesn't crash and the scroll is updated accordingly.
		setTimeout(() => {
			const newArray = this.state.images.filter((element, index) => index !== slideIndex);
			this.setState({ images: newArray });
		}, delay);
	}

	/**
     * 清除最后一张图片
     */
	removeImages() {
		// Debugging helper : keep removing the last slide of the gallery.
		setInterval(() => {
			const { images } = this.state;
			console.log(images.length);
			if (images.length <= 1) {
				return;
			}
			const newArray = this.state.images.filter((element, index) => index !== this.state.images.length - 1);
			this.setState({ images: newArray });
		}, 2000);
	}

	/**
     * 位置变更回调
     */
	onChangeImage(index) {
		this.setState({ index });
	}

	// 图片显示错误控件
	renderError() {
		return (<View style={{
			flex: 1,
			backgroundColor: 'black',
			alignItems: 'center',
			justifyContent: 'center'
		}}>
		<DefaultImage
			resizeMode={'contain'}
			source={require('../assets/images/imgPlaceholder/type_width.png')}
		/>
		</View>);
	}

	renderActivity() {

		if (this.state.showLoading) {
			return (
				<ActivityIndicator style={styles.activityIndicator} animating color='white' size="large"/>
			);
		} else {
			return null
		}
	}

	// 显示图片张数控件
	get galleryCount() {
		const { index, images } = this.state;
		return (<View style={{
			bottom: 0,
			height: 65,
			backgroundColor: 'rgba(0, 0, 0, 0.7)',
			width: '100%',
			position: 'absolute',
			justifyContent: 'center'
		}}>
			<Text style={{
				textAlign: 'center',
				color: 'white',
				fontSize: 15,
				fontStyle: 'italic'
			}}>{index + 1}
				/ {images.length}</Text>
		</View>);
	}

	/*
     * 识别二维码
     */
	checkQRCode = async (imageUrl) => {
		if (Platform.OS === 'ios') {
			return await Media.recognitionQRCode({ uri: imageUrl });
		} else {
			return await NativeModules.YRURLCacheManager.getQRCodeInfoFromUrl(imageUrl);
		}
	}

	/**
     * 是否保存图片menu
     */
	saveMenu() {
		return (
			<View style={[styles.menuContainer, { height: this.getMenuHeight(), bottom: -this.getMenuHeight() }]} ref={menu => { this.menu = menu }}>
				<TouchableHighlight
					underlayColor="#F2F2F2"
					onPress={this.saveToLocal.bind(this)}
					style={styles.operateContainer}>
					<Text style={styles.operateText}>保存到手机相册</Text>
				</TouchableHighlight>
				{this.showQRSelect()}
				<TouchableHighlight
					underlayColor="#F2F2F2"
					onPress={() => {
						this.showMenu(false);
					}}
					style={styles.operateContainer}>
					<Text style={styles.operateText}>取消</Text>
				</TouchableHighlight>
			</View>)
	}

	// 控制是否显示保存图片弹出框
	showMenu = (show) => {
		if (show) {
			this.setState({
				menuVisible: true
			})
			this.menu.setNativeProps({
				bottom: 0
			});
		} else {
			this.setState({
				menuVisible: false
			})
			this.menu.setNativeProps({
				bottom: -this.getMenuHeight()
			});
		}

	}
	// 显示二维码扫描选项
	showQRSelect() {
		if (this.state.checkQRCode) {
			return (
				<TouchableHighlight
					underlayColor="#F2F2F2"
					onPress={this.completeQRCode}
					style={styles.operateContainer}>
					<Text style={styles.operateText}>识别二维码</Text>
				</TouchableHighlight>
			)
		} else {
			return null;
		}
	}

	// 完成识别二维码
	completeQRCode = () => {
		let imageSource = this.props.imageUrls[this.state.index];
		console.log('点击保存', imageSource.source.uri)
		let uri = imageSource.source.uri;
		this.showMenu(false);
		this.setState({ showLoading: true});
		this.checkQRCode(uri).then((response) => {
			console.log('response', response);
			this.setState({ showLoading: false});
			this.refs.toast.show('扫描成功');
			this.props.onQRResponse(response);
		}).catch((error) => {
			console.log('error', error);
			this.setState({ showLoading: false});
			this.refs.toast.show('扫描失败');
		});
	}

	/**
     * 图片保存到本地相册
     */
	 saveToLocal = async () => {
		let imageSource = this.props.imageUrls[this.state.index];
		console.log('点击保存', imageSource.source.uri)
		let uri = imageSource.source.uri;
		var promise = null
		this.showMenu(false);
		this.setState({ showLoading: true});
		if (Platform.OS === 'ios') {
			promise = CameraRoll.saveToCameraRoll(uri);
		} else {
			let result = await HttpManager.downloadImage(uri);
			promise = CameraRoll.saveToCameraRoll("file://" + result.filePath);
		}
		var that = this;
		promise.then(function (message) {
			that.setState({ showLoading: false});
			that.refs.toast.show('保存成功');
		}).catch(function(error){
			that.setState({ showLoading: false});
			that.refs.toast.show('保存失败');
			console.log(error)
		});
	}

	// 长按显示保存图片menu
	pageLongPressed = (state) => {
		let imageSource = this.props.imageUrls[this.state.index];
		console.log('点击保存', imageSource.source.uri)
		let uri = imageSource.source.uri;
		this.showMenu(true);
	}

	// 点击页面返回
	pageClicked = (page) => {
		if (this.state.menuVisible) {
			this.showMenu(false);
		} else {
			this.props.onClick(page);
		}
	}

	renderImageComponent = (props, demision) => {
		return <Image { ...props }
			resizeMode={'contain'}
			defaultSourceStyle={{ backgroundColor: 'transparent' }}
			defaultSource={require('../assets/images/imgPlaceholder/type_width.png')}
		/>;
	}

	render() {

		return (<View style={{ flex: 1, backgroundColor: 'black' }}>
			<Gallery style={{ flex: 1, backgroundColor: 'black' }}
				images={this.props.imageUrls}
				errorComponent={this.renderError}
				onSingleTapConfirmed={this.pageClicked}
				onPageSelected={this.onChangeImage}
				flatListProps={ {
					initialNumToRender: this.props.imageUrls.length,
					initialScrollIndex: this.state.initialPage,
					getItemLayout: (data, index) => ({
						length: winWidth,
						offset: winWidth * index, index})
					}
				}
				initialPage={this.props.initialPage}
				onLongPress={this.pageLongPressed}
				imageComponent={this.renderImageComponent}
			/>
			{this.galleryCount}
			{this.saveMenu()}
			{this.renderActivity()}
			<ToastView ref="toast" position={'center'} />
		</View>);
	}
}

const styles = StyleSheet.create({
	menuContainer: {
		position: 'absolute',
		width: winWidth,
		left: 0,
		backgroundColor: 'transparent',
		flexDirection: 'column',
		alignItems: 'center'
	},
	operateContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		width: winWidth - 20,
		height: 50,
		borderRadius: 5,
		marginBottom: 5
	},
	operateText: {
		color: '#1087ff'
	},
	activityIndicator: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		marginLeft: transformSize(-18),
		marginTop: transformSize(-18),
	}
});
