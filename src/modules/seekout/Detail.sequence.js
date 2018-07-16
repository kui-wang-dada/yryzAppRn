import React, { Component } from 'react';
import { ImageBackground, ART, Animated, Platform, SafeAreaView, DeviceEventEmitter, UIManager } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const { Surface, Shape, Path } = ART;
import { StyleSheet, ScrollView, View, Tag, TagGroup, Panel, Image, Icon, Touchable, FlowList, Text, Share, Toast } from '@components';
import { transformSize, cacheAsync, circle, umengTrack, modal, env, commonStyle } from '@utils';
import NavigationBar from './components/NavigationBar';
import Lively from './components/Lively';

const Dimensions = require('Dimensions');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const TEMP_DEFAULT = 1; // 大众化模板
const JUMP = 0;  // 跳转
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			scale: new Animated.Value(0),
			navOpacity: 0
		};
		this.navOpacity = 0;
		this.scrollY = new Animated.Value(0);
	}

	renderHeader() {
		return (
			<ImageBackground source={{ uri: this.state.data.detailBackendImg }} style={decorate.background}>
				{/* <View style={decorate.nav}>
					<Touchable onPress={() => this.props.navigation.goBack()} style={decorate.tapPad}>
						<Icon name="arrow-left" style={decorate.navIcon} />
					</Touchable>
					<Touchable onPress={this.popupShare.bind(this)} style={decorate.tapPad}>
						<Icon name="more" style={[decorate.navIcon, { fontSize: transformSize(10) }]} />
					</Touchable>
				</View> */}
			</ImageBackground>
		);
	}

	renderTop() {
		let { data } = this.state;
		return (
			<View style={decorate.top}>
				<Text style={decorate.title}>{data.configTitle}</Text>
				<Text style={decorate.description}>{data.configDetailDesc}</Text>
			</View >
		);
	}

	renderItem(node, index) {
		let activeOpacity = node.checkJump === 1 ? 1 : 0.5;
		return (
			<Touchable onPress={this.to.bind(this, node, index)} key={node.kid} activeOpacity={activeOpacity}>
				<View style={decorate.item}>
					<View style={decorate.itemLeft}>
						<ImageBackground style={decorate.serialNumber} source={require('@assets/images/bubble.png')}>
							<Text style={decorate.number}>{index + 1}</Text>
						</ImageBackground>
						<Image style={decorate.line} source={require('@assets/images/line.png')} roundAsCircle={true} />
					</View>
					<View style={decorate.itemRight}>
						<Text style={decorate.itemTitle}>{node.nodeTitle}</Text>
						<ImageBackground source={{ uri: node.nodeImg1 }} roundAsCircle={true} style={decorate.itemImage} >
							{
								node.checkJump === 1 ? null :
									<View style={decorate.defaultHandBox}>
										<Animated.Image
											source={require('./assets/pk-press.png')}
											style={[decorate.handDefault, {
												transform: [{ scale: this.state.scale }]
											}]}
										/>
									</View>
							}
						</ImageBackground>
						<Text style={decorate.itemDescription} numberOfLines={3}>{node.nodeDesc}</Text>
					</View>
				</View>
			</Touchable>
		);
	}


	render() {
		let { data, navOpacity, scale, shake } = this.state;
		if (!data) {
			return null;
		}
		console.log(data.nodeList);
		let tempType = data.templateType === TEMP_DEFAULT;
		return (
			<SafeAreaView style={decorate.container}>
				<NavigationBar scrollY={this.scrollY} more={this.popupShare.bind(this)}>
					<Text style={decorate.navTitle} numberOfLines={1}>{data.configTitle}</Text>
				</NavigationBar>
				<Animated.ScrollView
					ref={ref => this.scrollRef = ref}
					scrollEventThrottle={20}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
						{
							listener: this.onScroll.bind(this),
							useNativeDriver: true
						},
					)}
				>
					{this.renderHeader()}
					<View>
						{this.renderTop()}
						<LinearGradient colors={['#F7F6F5', '#FEFEFE']} locations={[.2, 1]} style={{ height: transformSize(30) }} />
						<View style={[decorate.listGroup]}>
							{
								data.nodeList.map((node, index) => {
									let item = data.templateType === TEMP_DEFAULT ?
										this.renderItem(node, index) :
										(<View key={index} onLayout={e => this.handleLayout(e, index)}>
											<Lively
												ref={ref => this['item' + index] = ref}
												node={node}
												index={index}
												onPress={this.to.bind(this)}
												scrollY={this.scrollY}
												total={data.nodeList.length}
											/>
										</View>)
									return item;
								})
							}
						</View>
					</View>
				</Animated.ScrollView >
			</SafeAreaView>
		);
	}

	handleLayout = (e, index) => {
		// 设置当前的layout 高度
		console.log('layout' + index, e.nativeEvent.layout);
		this['item' + index].setLayout(e.nativeEvent.layout)
	}


	async componentDidMount() {
		this.transformScale(1);
		let { id } = this.props.navigation.state.params;
		let res = await cacheAsync(`/services/app/v1/find/findOrderDetail/${id}`)
		let data = res.data.data;
		this.setState({
			data
		});
		umengTrack('找到详情', { '找到': id, '类型': '顺序' });
	}

	to(node, index) {
		if (node.checkJump !== JUMP) {
			return;
		}
		let resourceType = node.resourceType;
		let navigation;
		switch (resourceType) {
			case 1:
				umengTrack('文章详情', { '来源': '找到_顺序详情' })
				navigation = 'ArticleDetail';
				break;
			case 2:
				umengTrack('视频详情', { '来源': '找到_顺序详情' })
				navigation = 'VideoDetail';
				break;
			case 3:
				umengTrack('应用详情', { '来源': '找到_顺序详情' })
				navigation = 'AppDetail';
				break;
		}
		this.props.navigation.navigate(navigation, { id: node.resourceId });
	}

	onScroll(e) {
		let scrollTop = e.nativeEvent.contentOffset.y;

		if (transformSize(scrollTop) > 20) {
			this.navOpacity += 0.2;
			this.navOpacity = this.navOpacity > 1 ? 1 : this.navOpacity;
		} else {
			this.navOpacity -= 0.2;
			this.navOpacity = this.navOpacity < 0 ? 0 : this.navOpacity;
		}
		if (scrollTop === 0) {
			this.navOpacity = 0;
		}
		if (transformSize(scrollTop) > 100) {
			this.navOpacity = 1;
		}
		this.setState({
			navOpacity: this.navOpacity
		});
	}



	popupShare() {
		let { data } = this.state;
		let { id } = this.props.navigation.state.params;
		let temp1 = `${env.webBaseUrl}/find-time-share/${id}`;
		let temp2 = `${env.webBaseUrl}/find-order-share/${id}`;

		let url = data.templateType === 1 ? temp1 : temp2;

		let cofig = {
			title: `【悠然一指】${data.configTitle}`,
			content: data.coverProfileDesc,
			url,
			imgUrl: data.indexBannerImg
		};
		let collect = {
			id,
			favoriteFlag: data.favoriteFlag,
			moduleCode: '1010',
			changeCollectState: (state) => {
				let flag = state ? 1 : 0;
				data.favoriteFlag = flag;
				this.setState({
					data
				}, () => {
					Toast.show(state ? '收藏成功' : '已取消收藏');
				});
				DeviceEventEmitter.emit('CancelCollection');
			}
		};
		modal.show(
			<Share data={cofig} collect={collect} report  {...this.props} />,
			'share'
		);
	}


	transformScale(value) {
		let scale = value === 1 ? 0.7 : 1;
		Animated.timing(this.state.scale, {
			toValue: scale,
			duration: 350
		}).start(() => {
			this.transformScale(scale);
		});
	}
}


const decorate = StyleSheet.create({
	navTitle: {
		fontSize: transformSize(34),
		color: 'black'
	},
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	background: {
		width: commonStyle.screenWidth,
		height: transformSize(200)
	},
	tapPad: {
		paddingHorizontal: transformSize(30),
		paddingVertical: transformSize(15),
		justifyContent: 'center',
		alignItems: 'center',
	},
	top: {
		paddingVertical: transformSize(50),
		paddingHorizontal: transformSize(50),
		borderTopLeftRadius: transformSize(18),
		borderTopRightRadius: transformSize(18),
		marginTop: transformSize(-20),
		backgroundColor: 'white'
	},
	title: {
		marginBottom: transformSize(30),
		fontSize: transformSize(44),
		color: 'black',
	},
	description: {
		fontSize: transformSize(28),
		color: '#666',
	},
	listGroup: {
		paddingHorizontal: transformSize(50),
		paddingVertical: transformSize(80),
		// paddingBottom: transformSize(0),
		backgroundColor: 'white'
	},
	itemLeft: {
		width: transformSize(62),
		alignItems: 'center',
	},
	serialNumber: {
		width: transformSize(60),
		height: transformSize(60),
		marginBottom: transformSize(38),
		justifyContent: 'center',
		alignItems: 'center'
	},
	number: {
		fontSize: transformSize(40),
		lineHeight: transformSize(40),
		includeFontPadding: false,
		color: 'white',
	},
	line: {
		width: transformSize(5),
		height: transformSize(346),
	},
	itemTitle: {
		marginBottom: transformSize(40),
		fontSize: transformSize(40),
		color: 'black'
	},
	item: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: transformSize(41)
	},
	itemRight: {
		width: transformSize(540)
	},
	itemImage: {
		width: transformSize(540),
		marginBottom: transformSize(24),
		justifyContent: 'flex-end',
		height: transformSize(212),
		borderRadius: transformSize(16),
		overflow: 'hidden'
	},
	itemDescription: {
		includeFontPadding: false,
		lineHeight: transformSize(38),
		fontSize: transformSize(28),
		color: 'black'
	},
	linkLineBox: {
		paddingVertical: transformSize(36),
		alignItems: 'center'
	},
	linkLine: {
		width: transformSize(245),
		height: transformSize(79)
	},
	nav: {
		paddingTop: transformSize(66),
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	navIcon: {
		includeFontPadding: false,
		fontSize: transformSize(36),
		color: 'white'
	},
	handIcon: {
		width: transformSize(68),
		height: transformSize(44)
	},
	handLeft: {
		marginLeft: transformSize(50)
	},
	handRight: {
		marginRight: transformSize(50)
	},
	defaultHandBox: {
		alignSelf: 'flex-end',
		width: transformSize(120),
		height: transformSize(120),
		marginRight: transformSize(-60),
		marginBottom: transformSize(-60),
		borderRadius: transformSize(60),
		backgroundColor: 'rgba(0,0,0,.5)'
	},
	handDefault: {
		width: transformSize(27),
		height: transformSize(42),
		marginLeft: transformSize(25),
		marginTop: transformSize(12)
	}
});