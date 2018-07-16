
import React from 'react';
import { commonStyle, transformNum, modal, cacheAsync, cache, umengTrack, env, transformSize, isIphoneX } from '@utils';
import { DiscussItem } from './components';
import { Animated, StatusBar, DeviceEventEmitter, Image, RefreshControl, InteractionManager, ActivityIndicator, SafeAreaView } from 'react-native'
import { Follow } from '@modules/article';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	Touchable,
	Icon,
	FlowList,
	Share,
	Platform,
} from '@components'
import { ButtonWithAuth } from '@modules/user';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
let headerHeight = isIphoneX() ? transformSize(244) : transformSize(200);

@connect()
export default class SquareDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			squareDetail: {},
			refreshing: false,
		}
		this._statusBarStyle = 'light-content'
		this.setFlowListRef = this.setFlowListRef.bind(this);
	}

	componentWillMount() {
		this.scrollY = new Animated.Value(0);
		StatusBar.setBarStyle(this._statusBarStyle)
	}

	renderHeader = (squareDetail) => {

		const headerOpacityTranslate = this.scrollY.interpolate({
			inputRange: [0, headerHeight, 2 * headerHeight],
			outputRange: [0, 0, 1],
			extrapolate: 'clamp',
		});
		const whiteTextOpacity = this.scrollY.interpolate({
			inputRange: [0, headerHeight, 2 * headerHeight],
			outputRange: [1, 1, 0],
			extrapolate: 'clamp',
		});
		const blackTextOpacity = this.scrollY.interpolate({
			inputRange: [0, headerHeight, 2 * headerHeight],
			outputRange: [0, 0, 1],
			extrapolate: 'clamp',
		});
		const headerTextOpacityTranslate = this.scrollY.interpolate({
			inputRange: [0, 2 * headerHeight - 1, 2 * headerHeight],
			outputRange: [0, 0, 1],
			extrapolate: 'clamp',
		});
		return (
			<View style={style.headerContainer}>

				<Touchable transparent onPress={this._handleBack} style={style.fixedBack}>
					<AnimatedIcon name="arrow-left" style={[style.arrowBack, { opacity: whiteTextOpacity }]} />
					<Animated.View style={[
						style.opositeArrowBack,
						{ opacity: blackTextOpacity }]} >
						<Icon name="arrow-left" style={style.arrowBlack} />
					</Animated.View>

				</Touchable>
				<Touchable transparent onPress={this.openMenu} style={style.fixedMenu}>
					<AnimatedIcon name="more"
						style={[style.moreIcon, { opacity: whiteTextOpacity }]} size={5} />
					<Animated.View style={[
						style.moreIconBlack,
						{ opacity: blackTextOpacity }]} >
						<Icon name="more" color="#000" size={5} />
					</Animated.View>

				</Touchable>
				<Animated.View
					style={[style.stickySection, { opacity: headerOpacityTranslate }]} >
					<Animated.View style={[style.headerTitleWrap, { opacity: headerTextOpacityTranslate }]}>
						<Text numberOfLines={1}
							style={[style.headerSubject]}>
							{squareDetail.subject}
						</Text>
					</Animated.View>
				</Animated.View>
			</View>
		)
	}
	renderHeaderBackground = (squareDetail) => {
		const headerOffsetTranslate = this.scrollY.interpolate({
			inputRange: [0, 2 * headerHeight],
			outputRange: [0, -headerHeight],
			extrapolate: 'clamp',
		});
		const indicatorOpacity = this.scrollY.interpolate({
			inputRange: [0, headerHeight - 1, headerHeight],
			outputRange: [1, 0, 0],
			extrapolate: 'clamp',
		})
		// const textOpacity = this.scrollY.interpolate({
		// 	inputRange: [0, headerHeight - 1, headerHeight],
		// 	outputRange: [1, 0, 0],
		// 	extrapolate: 'clamp',
		// })
		return (
			<Animated.View style={[{
				top: 0, left: 0, position: 'absolute',
			}, { transform: [{ translateY: headerOffsetTranslate }] }]}>
				<AnimatedIndicator style={[style.indicatorWrap, { opacity: indicatorOpacity }]} color='#fff'></AnimatedIndicator>
				<Animated.Text numberOfLines={1}
					style={[style.loadingTxt, { opacity: indicatorOpacity }]}>
					内容加载中...
				</Animated.Text>
				<Image source={{ uri: squareDetail.imgUrl }} style={style.subjectImg} />
			</Animated.View>

		)
	}
	renderListHeader = (squareDetail) => {
		let followText = <Icon name='add' style={style.iconFollow} size={12}>关注</Icon>;
		return (
			<View>
				<View style={{ height: commonStyle.transformSize(500), backgroundColor: 'transparent' }} ></View>
				<View style={style.subjectWrap}>
					<Text style={style.subjectTxt}>{squareDetail.subject}</Text>
					<View style={style.countWrap}>
						<View style={style.countTxtWrap}>
							<Text style={style.countTxt}>点赞{transformNum(squareDetail.likeCount)}</Text>
							<Text style={style.countTxt}>讨论{transformNum(squareDetail.talkCount)}</Text>
							<Text style={style.countTxt}>关注{transformNum(squareDetail.followCount)}</Text>
						</View>
						<Follow moduleCode={'1008'}
							followText={followText}
							style={style.followTxtWrap}
							activeStyle={style.followTxtWrap}
							active={squareDetail.followFlag === 1}
							id={parseInt(squareDetail.kid)}
							onChange={this.onChangeFollowed}
						></Follow>
					</View>
				</View>

				{/*<View style={style.talkListWrap}>
					{this.renderHotPost(squareDetail)}
					<View style={style.hotTalk}>
						<Text style={style.hotTalkTxt}>最新</Text>
					</View>

				</View>*/}
			</View>

		)
	}
	render() {
		let { squareDetail = {} } = this.state;
		if (!Object.keys(squareDetail).length) {
			return null;
		}
		return (
			<View style={commonStyle.container}>
				{this.renderHeader(squareDetail)}
				{this.renderHeaderBackground(squareDetail)}
				<FlowList
					ref={this.setFlowListRef}
					contentContainerStyle={{ minHeight: commonStyle.SCREEN_HEIGHT + headerHeight * 2 }}
					ListHeaderComponent={this.renderListHeader(squareDetail)}
					ItemSeparatorComponent={() => <View style={[style.separatorStyle, this.props.separatorStyle]}></View>}
					request={`/services/app/v1/square/post/list/${this.squareId}`}
					renderItem={this.renderItem}
					useAnimated={true}
					keyExtractor={this.extractKey}
					onFetchedData={this.onFetchedData}
					scrollEventThrottle={1}
					disabledRefresh={true}
					cacheFirstPage
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
						{ listener: this.handleScroll, useNativeDriver: true },
					)}
					bounces={false}
					onScrollEndDrag={(e) => this._onMomentumScrollEnd(e, 'onScrollEndDrag')}
					onMomentumScrollEnd={(e) => this._onMomentumScrollEnd(e, 'onMomentumScrollEnd')}
					onScrollAnimationEnd={this._onMomentumScrollEnd}
				/>

				{this.renderFixedEntry()}
			</View>
		)
	}
	handleScroll = (event) => {
		let { contentOffset } = event.nativeEvent;
		this.offsetY = contentOffset.y;
		let statusBarStyle = '';
		if (event.nativeEvent.contentOffset.y > headerHeight + 1) {
			statusBarStyle = 'dark-content'
		} else {
			statusBarStyle = 'light-content'

		}
		if (this._statusBarStyle !== statusBarStyle) {
			this._statusBarStyle = statusBarStyle
			StatusBar.setBarStyle(this._statusBarStyle);
		}
	}
	scrollToHeader = () => {
		InteractionManager.runAfterInteractions(() => {
			this._refPostList && this._refPostList._root._component.getScrollResponder().scrollTo({ x: 0, y: headerHeight });
		})
	}

	_onMomentumScrollEnd = (e, type) => {
		// console.warn(type);


		let { contentOffset } = e.nativeEvent;
		if (this.y === contentOffset.y) {
			return;
		}
		this.y = contentOffset.y;
		if (contentOffset.y < headerHeight) {
			this.scrollToHeader();
		}
		if (contentOffset.y < 10) {

			this.refreshData();
		}
	}
	setFlowListRef = (r) => {
		this._refPostList = r;
	}

	refreshData = async () => {

		if (this.state.refreshing) {
			return;
		}

		this.setState({ refreshing: true }, () => {
			try {
				// let res = await Promise.all([cacheAsync(`/services/app/v1/square/detail/${this.squareId}`),
				// cacheAsync(`/services/app/v1/square/post/list/${this.squareId}/1/20`)]);
				// let squareDetail = res[0].data.data;
				cache(`/services/app/v1/square/detail/${this.squareId}`, (res) => {
					let squareDetail = res.data.data;
					if (squareDetail.shelveFlag === 1) {
						this.props.navigation.replace('RemovedScreen');
						return;
					}
					this.setState({ squareDetail });
				});
				cache(`/services/app/v1/square/post/list/${this.squareId}/1/20`, (res) => {
					this.postList = res.data.data && res.data.data.entities;
					this._refPostList.updateData(this.postList);
				})
			} catch (ex) {
				// this.setState({ refreshing: false });
			} finally {
				this.setState({ refreshing: false });
				if (this.offsetY < headerHeight + 1) {
					this.scrollToHeader();

				}
			}
		})

	}
	renderFixedEntry = () => {
		return (
			<ButtonWithAuth
				transparent
				block
				onPress={this.handlePress}
				style={style.postBtnWrap}
			>
				<Icon name="edit" style={style.postBtnIcon} />
			</ButtonWithAuth>
		)
	}
	handlePress = () => {
		let { squareDetail } = this.state;

		let { subject } = squareDetail;

		this.props.navigation.navigate('PublishScreen', {
			id: this.props.navigation.state.params.id,
			squareTheme: subject,
			callback: () => {
				this._refPostList && this._refPostList._root._component.getScrollResponder().scrollTo({ x: 0, y: -2 * headerHeight });
				this.refreshData();
			}
		});
		umengTrack('广场详情_发布', { '广场详情': '发布' });
	}
	onChangeFollowed = (followState) => {
		let { squareDetail } = this.state;
		let { imgUrl, subject, kid, joinCount } = squareDetail;
		squareDetail.followFlag = followState ? 1 : 0;
		// 同步我的关注数据
		let followActionType = followState ? 'addSquareAttention' : 'deleteSquareAttention';
		this.props.dispatch({
			type: followActionType, payload: {
				imgUrl, subject, kid, joinCount
			}
		});
		this.setState({
			squareDetail
		});
	}
	onChangeHotListLike = (likeState, postItemId) => {
		let { squareDetail } = this.state;
		squareDetail.hotList.map((item) => {
			if (item.kid === postItemId) {
				item.likeFlag = likeState ? 1 : 0;
				likeState ? item.likeCount += 1 : item.likeCount -= 1;
			}
			return item;
		})
		this.setState({ squareDetail });
	}

	extractKey = (item, index) => index.toString();

	renderSeparator = () => <View style={[style.separatorStyle]}></View>

	openMenu = () => {
		let { subject, id, imgUrl, favoriteFlag, kid } = this.state.squareDetail;
		let data = {
			title: `【悠然一指】${subject}`,
			content: '发现应用里面有趣有料又好玩的信息',
			url: `${env.webBaseUrl}/square-share/${kid}`,
			imgUrl,
		}
		let collect = {
			id: kid,
			favoriteFlag,
			changeCollectState: this.changeCollectState,
			moduleCode: '1012'
		}
		let component = (<Share  {...this.props} data={data} report collect={collect} />)
		modal.show(component, 'share');
	}
	changeCollectState = (followState) => {
		let id = this.props.navigation.state.params.id;
		let { squareDetail } = this.state;
		followState = followState ? 1 : 0;
		squareDetail.favoriteFlag = followState;
		this.setState({ squareDetail });
		DeviceEventEmitter.emit('CancelCollection');
	}
	_handleBack = () => {
		this.props.navigation.goBack();
	}
	onFetchedData = (data, res) => {
		this.postList = data;
	}
	renderItem = ({ item }) => {
		return (
			<DiscussItem data={item} onChangeLike={this.onChangeLike} />
		);
	}
	onChangeLike = (likeState, postItemId) => {
		this.postList = this.postList.map((item) => {
			if (item.kid === postItemId) {
				item.likeFlag = likeState ? 1 : 0;
				likeState ? item.likeCount += 1 : item.likeCount -= 1;
			}
			return Object.assign({}, item);
		})
		this._refPostList.updateData(this.postList);
	}

	componentDidMount() {
		this.squareId = this.props.navigation.state.params.id;
		cacheAsync(`/services/app/v1/square/detail/${this.squareId}`)
			.then(res => {
				let squareDetail = res.data.data;
				if (squareDetail.shelveFlag === 1) {
					this.props.navigation.replace('RemovedScreen');
					return;
				}
				this.setState({ squareDetail });
				umengTrack('广场_广场详情', { '广场详情': squareDetail.subject });
			})
		InteractionManager.runAfterInteractions(() => {
			this._refPostList && this._refPostList._root._component.getScrollResponder().scrollTo({ x: 0, y: headerHeight });
		})

	}
	componentWillUnmount() {
		StatusBar.setBarStyle('default');
	}

}

const style = StyleSheet.create({
	container: {
		// backgroundColor: '#fff',
		overflow: 'hidden',
		flex: 1

	},
	flowlist: {
		top: 0, left: 0, position: 'absolute'
	},
	listHeaderWrap: {
		// position: 'absolute',
		height: commonStyle.transformSize(700),
		backgroundColor: 'transparent',
		// top: -commonStyle.transformSize(120),
	},
	subjectImg: {
		width: commonStyle.SCREEN_WIDTH,
		height: commonStyle.transformSize(700),
		justifyContent: 'flex-end',
	},
	subjectWrap: {
		paddingHorizontal: commonStyle.padding,
		paddingBottom: commonStyle.transformSize(40),
		justifyContent: 'flex-end',
	},
	subjectTxt: {
		fontSize: commonStyle.transformSize(40),
		fontWeight: 'bold',
		color: '#fff',
		shadowColor: '#000',
		shadowOffset: { x: 15, y: 15 },
		shadowOpacity: 0.8,
	},
	countWrap: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginTop: commonStyle.transformSize(26),
		alignItems: 'center',
	},
	countTxtWrap: {
		flexDirection: 'row',
	},
	countTxt: {
		fontSize: commonStyle.transformSize(24),
		color: '#fff',
		marginRight: commonStyle.transformSize(30),
		shadowOffset: { x: 15, y: 15 },
		shadowOpacity: 0.8,
	},
	followTxtWrap: {
		borderRadius: commonStyle.transformSize(25),
		// width: commonStyle.transformSize(128),
		height: commonStyle.transformSize(50),
		backgroundColor: '#fff',
	},
	iconFollow: {
		fontSize: commonStyle.transformSize(28),
		color: '#543dca',
	},
	arrowBack: {
		fontSize: commonStyle.transformSize(34),
		color: '#fff',
		position: 'absolute',
	},
	arrowBlack: {
		fontSize: commonStyle.transformSize(34),
		color: '#000',
	},
	opositeArrowBack: {

		position: 'absolute',
	},
	fixedBack: {
		position: 'absolute',
		bottom: Platform.select({
			'ios': -5,
			'android': 0,
		}),
		left: 0,
		zIndex: 2,
		width: commonStyle.transformSize(84),
		height: commonStyle.transformSize(120),
		...commonStyle.centerWrap,
	},
	fixedMenu: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		zIndex: 2,
		width: commonStyle.transformSize(112),
		height: commonStyle.transformSize(120),
		...commonStyle.centerWrap,
	},
	moreIcon: {
		color: '#fff',
		position: 'absolute',
		marginTop: Platform.select({
			'ios': 2,
			'android': 0,
		}),
	},
	moreIconBlack: {
		position: 'absolute',
		marginTop: Platform.select({
			'ios': 2,
			'android': 0,
		}),
	},

	headerContainer: {
		flexDirection: 'row',
		backgroundColor: 'transparent',
		height: (isIphoneX() ? transformSize(176) : transformSize(128)),
		// marginTop: Platform.select({
		// 	'ios': commonStyle.transformSize(50),
		// 	'android': 0
		// }),
		position: 'absolute',
		top: 0,
		zIndex: 1,
	},
	stickySection: {
		width: '100%',
		backgroundColor: '#fff',
		...commonStyle.centerWrap,
		height: (isIphoneX() ? transformSize(176) : transformSize(128)),
		paddingHorizontal: commonStyle.transformSize(150),
		borderBottomWidth: commonStyle.transformSize(2),
		borderBottomColor: '#eee',
	},
	headerTitleWrap: {
		...commonStyle.centerWrap,
		paddingTop: isIphoneX() ? transformSize(64) : transformSize(20),
	},
	headerSubject: {
		fontSize: commonStyle.transformSize(34),
		color: '#000',
		bottom: Platform.select({
			'ios': -3,
			'android': 0,
		}),
	},
	hotTalk: {
		height: commonStyle.transformSize(100),
		paddingHorizontal: commonStyle.transformSize(40),
		backgroundColor: '#f7f7f7',
		justifyContent: 'center',
	},
	hotTalkTxt: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: commonStyle.transformSize(40),
	},
	separatorStyle: {
		height: 0.5,
		backgroundColor: '#E5E5E5',
		width: '100%',
	},
	hide: {
		display: 'none',
	},
	postBtnWrap: {
		width: commonStyle.transformSize(100),
		height: commonStyle.transformSize(100),
		borderRadius: commonStyle.transformSize(50),
		backgroundColor: '#9567ea',
		position: 'absolute',
		bottom: commonStyle.transformSize(60),
		right: commonStyle.transformSize(40),
		...commonStyle.centerWrap,
		shadowOffset: { height: 3 },
		shadowColor: '#9567ea',
		shadowOpacity: 0.6,
		shadowRadius: 1,
		elevation: 3,
	},
	postBtnIcon: {
		color: '#fff',
		fontSize: commonStyle.transformSize(60),
	},
	indicatorWrap: {
		position: 'absolute',
		top: commonStyle.transformSize(120),
		left: commonStyle.transformSize(250),
		zIndex: 3,
		opacity: 0,
	},
	loadingTxt: {
		color: '#fff',
		position: 'absolute',
		top: commonStyle.transformSize(120),
		left: commonStyle.transformSize(300),
		zIndex: 3,
		opacity: 0,

	}
})
