import React from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import {
	Image, SwiperNew, Toast, Button, Input,
	Loading, StatusBar, Tag, Touchable, Icon, YModal, Rating, Share, InputKeyboard, ReadMoreText, UpdateModal
} from '@components';
import ActionSheet from '@components/ActionSheet'
import { commonStyle, modal, transformSize } from '@utils';
import ImagePreview from '../../components/ImagePreview'
import VideoDetailScreen from '../video/VideoDetailScreen'
import VideoCommentModal from '../video/VideoCommentModal'
import { http } from '@services';
import { signIn, signOut } from '@modules/user/user.action';
import store from '@src/store';
import { AsyncStorage } from 'react-native';
import { ChannelModule } from '@native-modules'

const images = [
	// { source: require('../image/placehold.jpg') },
	{
		// caption: 'This image has a broken URL',
		source: { uri: 'http://wrongdomain.tld/images/wrongimage.jpg' }
	},
	{
		// caption: 'Remote image with supplied dimensions',
		source: { uri: 'http://i.imgur.com/gSmWCJF.jpg' },
		dimensions: { width: 1200, height: 800 }
	},
	{ source: { uri: 'http://i.imgur.com/VG7o5H6.jpg' } },
	{ source: { uri: 'http://i.imgur.com/XP2BE7q.jpg' } },
	{ source: { uri: 'http://i.imgur.com/5nltiUd.jpg' } },
	{ source: { uri: 'http://i.imgur.com/6vOahbP.jpg' } },
	{ source: { uri: 'http://i.imgur.com/kj5VXtG.jpg' } },
	{ source: { uri: 'http://i.imgur.com/BN8RVGa.jpg' } },
];

class DemoScreen extends React.Component {

	constructor(...args) {
		super(...args);
		this.state = {
			index: 2,
			modalVisible: false,
			modalVisibleVideo: false,
			showCommentModal: false
		};
		this.showUpdateModal = this.showUpdateModal.bind(this);
	}

	renderImagePreview = () => {
		return (
			<Modal
				visible={this.state.modalVisible}
				onRequestClose={() => {
					this.showImagePreview(false)
				}}
				transparent={true}>
				<ImagePreview
					imageUrls={images}
					checkQRCode={true}
					initialPage={1}
					onClick={(page) => {
						this.showImagePreview(false)
						console.log('点击', page);
					}}
					onQRResponse={(response) => {
					}}
				/>
			</Modal>
		)
	}

	renderVideoDetail = () => {
		let video = {
			id: 100000,
			title: '这是标题。。。。',
			videoUrl: 'https://cdn.yryz.com/yryz-new/video/4c54f23a-ee5e-4940-b816-aced7e19ba7c.mp4',
			videoDuration: 13
		}
		let videos = [video, video, video, video, video, video];
		return (
			<Modal
				style={{ backgroundColor: 'white' }}
				visible={this.state.modalVisibleVideo}
				onRequestClose={() => { }}
				transparent={true}>
				<VideoDetailScreen style={{ backgroundColor: 'white' }} currentIndex={0} videos={videos}
					onClose={
						() => {
							this.showVideoDetail(false);
						}}
					onPageChange={
						(index) => {
							console.log(index);
						}
					}
				/>
			</Modal>
		)
	}

	showUpdateModal = async () => {
		let res = await http.get(`/services/app/v1/upgrade/info`)
		let response = res.data.data
		// alert(JSON.stringify(response))
		// 有新版本
		if (response.upgradeFlag) {
			let component = (
				<UpdateModal
					hideModal={modal.close}
					forceUpdate={response.forceUpgradeFlag}
					updateContent={response.upgradeNotice}
					onUpdate={() => {
						if (response.clearCacheFlag || response.logoutFlag) {
							this.clearCache()
						}
					}}
				/>
			)
			modal.show(component, 'centerModal', response.forceUpgradeFlag)
		}
	}

	clearCache = () => {
		// 清除所有缓存
		AsyncStorage.clear()
		store.dispatch(signOut());
	}

	showImagePreview = (show) => {
		this.setState({
			modalVisible: show
		})
	}

	showVideoDetail = (show) => {
		this.setState({
			modalVisibleVideo: show
		})
	}

	render() {
		let { navigate } = this.props.navigation;
		return (
			<ScrollView style={{ flex: 1 }}>
				<ReadMoreText numberOfLines={3}>
					<Text style={{ fontSize: commonStyle.transformSize(30) }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
				eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
				enim ad minim veniam, quis nostrud exercitation ullamco laboris
				nisi ut aliquip ex ea commodo consequat.  Duis aute irure dolor
				in reprehenderit in voluptate velit esse cillum dolore eu fugiat
				nulla pariatur. Excepteur sint occaecat cupidatat non proident,
				sunt in culpa qui officia deserunt mollit anim id est laborum
				</Text>
				</ReadMoreText>
				<Button title='FlowList' onPress={() => navigate('FlowList')} />
				<Button title='TabView' onPress={() => navigate('TabViewScreen')} />
				<Text
					style={{ width: transformSize(300), backgroundColor: '#f81', marginTop: 20 }}
					onPress={() => { this.props.navigation.navigate('ArticleDetail', { id: '11747817' }) }}>Article Detail
				</Text>
				<Text
					style={{ width: transformSize(300), backgroundColor: '#f81', marginTop: 10 }}
					onPress={() => { this.props.navigation.navigate('AppDetail', { id: '255' }) }}>App Detail
				</Text>
				<Text
					style={{ width: transformSize(300), backgroundColor: '#f81', marginTop: 10 }}
					onPress={() => { this.props.navigation.navigate('SquareDetail', { id: '14670532' }) }}>Square Detail
				</Text>
				{/*<Text
					style={{ width: transformSize(300), backgroundColor: '#f81', marginTop: 10 }}
					onPress={() => { this.props.navigation.navigate('ReplyDetail', { commentData: require('@modules/article/mockData/commentData').commentData, replyCount: 5, artData: { id: '11747817' } }) }}>Reply Detail
				</Text>*/}
				<Text
					style={{ width: transformSize(300), backgroundColor: '#f81', marginTop: 10 }}
					onPress={() => { this.props.navigation.navigate('ArticleTag', { tagId: '1212', tagName: '大神' }) }}>Article Tag
				</Text>
				<Text
					style={{ width: commonStyle.SCREEN_WIDTH, backgroundColor: '#f81', marginTop: transformSize(80) }}
					onPress={() => { this.showImagePreview(true) }}>Show Images
				</Text>
				<Text
					style={{ width: transformSize(300), backgroundColor: '#f81', marginTop: transformSize(80) }}
					onPress={() => { this.props.navigation.navigate('LoginScreen') }}>进入登录页面
				</Text>
				<Text
					style={{ width: transformSize(300), backgroundColor: '#f81', marginTop: transformSize(80) }}
					onPress={() => { this.showUpdateModal() }}>弹出强制更新
				</Text>
				<Image style={style.imgWrap} source={{ uri: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2093149115,3643453234&fm=27&gp=0.jpg' }}></Image>
				{this.renderPubCom()}
				{}
				{this.renderImagePreview()}
				{this.renderVideoDetail()}
				<Text
					style={{ width: commonStyle.SCREEN_WIDTH, backgroundColor: '#f81', marginTop: commonStyle.transformSize(80) }}
					onPress={() => { this.showVideoDetail(true) }}>Show Video Detail
				</Text>
				<InputKeyboard
					inputHeight={this.state.inputHeight}
					ref={(ref) => this._inputKeyboard = ref}
					alertSubmit={this.alertSubmit}
				>
				</InputKeyboard>
			</ScrollView >
		);
	}

	renderPubCom = () => {
		return (
			<ScrollView ref={(ref) => this.scrollView = ref}>
				{/* <Text>我的</Text> */}
				{/* <ActionSheet></ActionSheet> */}
				{/* <SwiperNew></SwiperNew> */}

				<Button
					style={style.buttonStyle}
					backgroundColor='red'
					icon={{ name: 'cached' }}
					title='BUTTON WITH ICON'>
				</Button>

				<Image source={require('@assets/images/logo-placeholder.png')}></Image>
				<Input ></Input>
				<Loading></Loading>
				<StatusBar></StatusBar>
				<Tag></Tag>
				<Touchable></Touchable>
				{/* <Icon></Icon> */}
				<Button onPress={this.toRefresh.bind(this)} title='Refresh'></Button>
				<Button onPress={this.toSeek.bind(this)} title='toSeek'></Button>
				<Button onPress={this.toSeekD.bind(this)} title='应用列表勿删'></Button>
				<Button onPress={this.combination.bind(this)} title='组合'></Button>
				<Button onPress={this.getYModal} title='getYModal'></Button>
				<Button onPress={this.getActionSheet} title='getActionSheet'></Button>
				<Button onPress={this.getShare} title='share'></Button>
				<Button onPress={() => { this.props.navigation.navigate('HotSearch') }} title='hotSearch'></Button>
				<Rating
				// onFinishRating={this.ratingCompleted}
				/>
				<Button onPress={this.getToast} title='getToast'></Button>
				<Button onPress={this.getShare} title='getShare'></Button>
				<Button onPress={() => this.props.navigation.navigate('Message')} title='消息列表' />
				<Button onPress={() => this.props.navigation.navigate('MyAttention')} title='我的关注' />
				<Button onPress={this.getInputKeyboard} title='getInputKeyboard'></Button>
				<Button title={this.state.showCommentModal ? '隐藏评论列表' : '显示评论列表'} onPress={this.onCommentModal} />
				<Button onPress={this.getChannelName} title='获得渠道码' />
			</ScrollView >
		)
	}


	getChannelName = () => {
		ChannelModule.getChannelName().then((data) => {

		}).catch((e) => {

		});
	}

	renderCommentModel = () => {
		let data = { id: 11747817 };
		return (
			< VideoCommentModal isVisible={this.state.showCommentModal} artData={data} />
		)
	}

	onCommentModal = () => {
		let { showCommentModal } = this.state;
		this.setState({ showCommentModal: !showCommentModal })
	}

	toRefresh() {
		this.props.navigation.navigate('ListView');
	}

	toSeek() {
		this.props.navigation.navigate('Categories');
	}
	toSeekD() {
		this.props.navigation.navigate('Categories');
	}
	getInputKeyboard = () => {
		this._inputKeyboard.open();
	}
	combination() {
		this.props.navigation.navigate('Combination');
	}
	getToast = () => {
		Toast.show('我的天哪')
	}
	getYModal = () => {
		let component = (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Button large onPress={modal.close} title='点我关闭Modal'></Button>
		</View>)
		modal.show(component, 'centerModal')
	}
	onShow = () => { console.log('onShow') }
	getActionSheet = () => {
		const options = ['回复', '举报', '取消']
		let component = (
			<ActionSheet
				cancelButtonIndex
				callback={this.cbActionSheet}
				options={options}
			/>)
		modal.show(component, 'ActionSheet')
	}

	getShare = () => {
		let data = {
			title: 'Share title',
			content: 'I am sharing.',
			url: 'http://boring.wang/',
			imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1509472305202&di=3b529e52fc17c510783f6da30ed5989a&imgtype=0&src=http%3A%2F%2Fa3.topitme.com%2F8%2Fa2%2Fea%2F11283095091f4eaa28o.jpg'
		}
		let collect = {
			id: 'id',
			favoriteFlag: 0,
			changeCollectState: () => { },
		}
		let component = (<Share  {...this.props} data={data} report collect={collect} />)
		modal.show(component, 'share');
	}

	cbActionSheet = (index) => {

	}
}

const style = StyleSheet.create({
	imgWrap: {
		width: 200,
		height: 100,
	},
	buttonStyle: {
		flexDirection: 'column', width: 200, height: 100,
		borderRadius: 30
	}
})
export default DemoScreen;
