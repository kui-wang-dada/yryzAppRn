import React, { Component } from 'react';
import { ImageBackground, ART, Animated, SafeAreaView, DeviceEventEmitter } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, ScrollView, View, Tag, TagGroup, Panel, Image, Icon, Touchable, FlowList, Text, ActionSheet, Share, Toast, Button } from '@components';
import { transformSize, umengTrack, modal } from '@utils';
import commonStyle from '@utils/commonStyle';
import { cache, env } from '@utils';
import NavigationBar from './components/NavigationBar';


export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			shrink: false,
			scale: new Animated.Value(1)
		};
		this.navOpacity = 0;
		this.scrollY = new Animated.Value(0);
	}



	renderNavigationBar() {
		// let { navBar } = this.state;
		// if (!navBar) {
		// 	return null;
		// }
		// return (
		// 	<View style={decorate.navBar}>
		// 		<Touchable onPress={() => this.props.navigation.goBack()}>
		// 			<Icon name="arrow-left" style={decorate.navBarLeft} />
		// 		</Touchable>
		// 		<Touchable onPress={() => this.popupShare()}>
		// 			<Icon name="more" style={decorate.navBarRight} />
		// 		</Touchable>
		// 	</View>
		// );
	}

	renderTop() {
		let { data, navBar } = this.state;
		let activeOpacity1 = data.checkJumpApp1 === 0 ? 0.5 : 1;
		let activeOpacity2 = data.checkJumpApp2 === 0 ? 0.5 : 1;
		return (
			<View>
				<ImageBackground source={{ uri: data.detailBackendImg }} style={decorate.background}>
					{
						// navBar ? null :
						// 	<View style={decorate.nav}>
						// 		<Touchable onPress={() => this.props.navigation.goBack()} style={decorate.tapPad}>
						// 			<Icon name="arrow-left" style={decorate.navIcon} />
						// 		</Touchable>
						// 		<Touchable onPress={this.popupShare.bind(this)} style={decorate.tapPad}>
						// 			<Icon name="more" style={[decorate.navIcon, { fontSize: transformSize(10) }]} />
						// 		</Touchable>
						// 	</View>
					}
				</ImageBackground>
				<View style={decorate.sloganBox}>
					<Text style={decorate.slogan} numberOfLines={2}>{data.configDetailDesc}</Text>
					<Image source={require('@assets/images/pk.png')} style={decorate.pk} placeholderDisabled />
				</View>
			</View>
		);
	}

	renderItem(node, index) {
		let activeOpacity = node.checkJump === 1 ? 1 : 0.5;
		return (
			<Touchable onPress={this.to.bind(this, node, index)} key={index} activeOpacity={activeOpacity}>
				<View style={decorate.listItem} >
					<LinearGradient
						colors={['#9a6be5', '#8b5bf9']}
						start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
						locations={[0, 1]} style={decorate.itemTag}>
						<Text style={decorate.tagName} numberOfLines={1}>{node.nodeTitle}</Text>
					</LinearGradient>
					<View style={decorate.itemWrap}>
						<View style={decorate.itemInner}>
							<Image source={{ uri: node.nodeImg1 }} style={decorate.itemImage} />
							<View style={decorate.itemCenter}>
								<Image source={require('@assets/images/pk-center.png')} placeholderDisabled style={decorate.itemPK} />
								{
									node.checkJump === 0 ?
										<Animated.Image source={require('./assets/pk-press.png')} style={[{
											transform: [{ scale: this.state.scale }]
										}, decorate.pkHandle]} />
										: null
								}
							</View>
							<Image source={{ uri: node.nodeImg2 }} style={decorate.itemImage} />
						</View>
						<Text style={decorate.pkDescription}>{node.nodeDesc}</Text>
					</View>
				</View>
			</Touchable>
		);
	}



	renderApp() {
		let { data, shrink } = this.state;
		let activeOpacity1 = data.checkJumpApp1 === 0 ? 0.5 : 1;
		let activeOpacity2 = data.checkJumpApp2 === 0 ? 0.5 : 1;
		let moveY = this.scrollY.interpolate({
			inputRange: [0, 50, 100, 120],
			outputRange: [-0, -50, -100, -85],
			extrapolate: 'clamp'
		});
		let scale = this.scrollY.interpolate({
			inputRange: [0, 50, 100],
			outputRange: [1, 0.5, 0.314],
			extrapolate: 'clamp'
		});
		let opacity = this.scrollY.interpolate({
			inputRange: [0, 50, 100],
			outputRange: [1, 0.5, 0],
			extrapolate: 'clamp'
		});
		// let opacityPK = this.scrollY.interpolate({
		// 	inputRange: [0, 100, 120, 150],
		// 	outputRange: [0, 0, 0.5, 1],
		// 	extrapolate: 'clamp'
		// });
		return (
			<Animated.View style={[decorate.appBox, { transform: [{ translateY: moveY }, { scale }] }]}>
				<Touchable onPress={this.appJump.bind(this, 1)} activeOpacity={activeOpacity1}>
					<View style={decorate.appItem}>
						<Image source={{ uri: data.appImg1 }} style={decorate.appIcon} circle placeholderDisabled />
						<Animated.Text style={[decorate.appName, { opacity }]}>{data.appName1}</Animated.Text>
					</View>
				</Touchable>
				{
					shrink ? <Image source={require('@assets/images/pk.png')} style={[decorate.pk, { marginTop: transformSize(-15) }]} /> : null
				}
				<Touchable onPress={this.appJump.bind(this, 2)} activeOpacity={activeOpacity2}>
					<View style={decorate.appItem}>
						<Image source={{ uri: data.appImg2 }} style={decorate.appIcon} circle placeholderDisabled />
						<Animated.Text style={[decorate.appName, { opacity }]}> {data.appName2}</Animated.Text>
					</View>
				</Touchable>
			</Animated.View>
		);
	}


	render() {
		let { data } = this.state;
		if (!data) return null;

		return (
			<SafeAreaView style={decorate.container} >
				<NavigationBar scrollY={this.scrollY} more={this.popupShare.bind(this)}>
					{/* <View style={decorate.navigationInner}>
						<Image source={{ uri: data.appImg1 }} style={decorate.navApp} placeholderDisabled />
						<Image source={require('@assets/images/pk.png')} style={decorate.navPK} placeholderDisabled />
						<Image source={{ uri: data.appImg2 }} style={decorate.navApp} placeholderDisabled />
					</View> */}
				</NavigationBar>
				{this.renderApp()}
				<Animated.ScrollView
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
						{
							useNativeDriver: true,
							listener: this.onScroll.bind(this)
						},
					)}
					scrollEventThrottle={1}
					showsVerticalScrollIndicator={false}
				// onScroll={this.onScroll.bind(this)}
				>
					{this.renderTop()}
					<View style={decorate.listGroup}>
						{
							data.nodeList.map((node, index) => {
								return this.renderItem(node, index)
							})
						}
					</View>
				</Animated.ScrollView>
			</SafeAreaView>
		);
	}

	openShare() {

	}

	componentDidMount() {
		this.getData();
		this.transformScale(1);
	}

	getData() {
		let { id } = this.props.navigation.state.params;
		umengTrack('找到详情', { '找到': id, '类型': 'PK' });
		cache(`/services/app/v1/find/findPkDetail/${id}`, (res) => {
			this.setState({
				data: res.data.data
			});
		});
	}

	onScroll(e) {
		let scrollTop = e.nativeEvent.contentOffset.y;
		// Toast.show(transformSize(scrollTop));
		if (transformSize(scrollTop) > 180) {
			return this.setState({
				shrink: true
			});
		}
		this.setState({
			shrink: false
		});
	}

	to(node) {
		if (node.checkJump === 1) {
			return;
		}
		let navigation = '';
		switch (node.resourceType) {
			case 1:
				umengTrack('文章详情', { '来源': '找到_PK详情' });
				navigation = 'ArticleDetail';
				break;
			case 2:
				umengTrack('视频详情', { '来源': '找到_PK详情' });
				navigation = 'VideoDetail';
				break;
			case 3:
				umengTrack('应用详情', { '来源': '找到_PK详情' });
				navigation = 'AppDetail';
				break;
		}
		this.props.navigation.navigate(navigation, { id: node.resourceId });
	}

	// 应用跳转
	appJump(n) {
		let { data } = this.state;
		let navigation = '';
		if (data[`checkJumpApp${n}`] === 0) {
			let type = data[`resourceType${n}`];
			switch (type) {
				case 1:
					umengTrack('文章详情', { '来源': '找到_PK详情' });
					navigation = 'ArticleDetail';
					break;
				case 2:
					umengTrack('视频详情', { '来源': '找到_PK详情' });
					navigation = 'VideoDetail';
					break;
				case 3:
					umengTrack('应用详情', { '来源': '找到_PK详情' });
					navigation = 'AppDetail';
					break;
			}
			this.props.navigation.navigate('ArticleDetail', { id: data[`resourceId${n}`] });
		}
	}

	popupShare() {
		let { data } = this.state;
		let { id } = this.props.navigation.state.params;
		let cofig = {
			title: `【悠然一指】${data.configTitle}`,
			// 封面简介
			content: data.coverProfileDesc,
			url: `${env.webBaseUrl}/find-pk-share/${id}`,
			imgUrl: data.indexBannerImg
		};
		let collect = {
			id,
			favoriteFlag: data.favoriteFlag,
			moduleCode: '1010',
			params: {
				configType: 2
			},
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
		}
		modal.show(
			<Share data={cofig} report collect={collect}  {...this.props} />,
			'share'
		);
	}

	// 动画比例转换
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

// 装饰
const decorate = StyleSheet.create({
	navigationInner: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	navApp: {
		width: transformSize(60),
		height: transformSize(60),
		borderRadius: transformSize(16),
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#e3e3e3'
	},
	navPK: {
		width: transformSize(60),
		height: transformSize(28),
		marginHorizontal: transformSize(60)
	},
	container: {
		flex: 1,
		backgroundColor: '#f3f3f3'
	},
	background: {
		height: transformSize(200),
		paddingTop: transformSize(50),
	},
	nav: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	navBar: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		zIndex: 9999,
		height: transformSize(80),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'white'
	},
	tapPad: {
		paddingHorizontal: transformSize(30),
		paddingVertical: transformSize(15),
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	navIcon: {
		includeFontPadding: false,
		fontSize: transformSize(36),
		color: 'white',
	},
	appBox: {
		position: 'absolute',
		width: '100%',
		top: transformSize(103),
		zIndex: 99,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	appIcon: {
		width: transformSize(155),
		height: transformSize(155),
		marginBottom: transformSize(20),
		borderRadius: transformSize(30),
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#e3e3e3'
	},
	appItem: {
		alignItems: 'center',
		marginHorizontal: transformSize(60),
		backgroundColor: 'transparent'
	},
	appName: {
		includeFontPadding: false,
		fontSize: transformSize(32),
		color: 'black'
	},
	slogan: {
		alignSelf: 'center',
		marginBottom: transformSize(40),
		fontSize: transformSize(26),
		color: '#999'
	},
	pk: {
		width: transformSize(88),
		height: transformSize(40),
		alignSelf: 'center'
	},
	sloganBox: {
		paddingTop: transformSize(158),
		paddingBottom: transformSize(40),
		marginTop: transformSize(-20),
		paddingHorizontal: transformSize(30),
		backgroundColor: 'white',
		borderTopLeftRadius: transformSize(16),
		borderTopRightRadius: transformSize(16)
	},
	listGroup: {
		paddingHorizontal: transformSize(30),
		paddingVertical: transformSize(40),
	},
	listItem: {
		paddingBottom: transformSize(40),
		marginBottom: transformSize(38),
		// paddingHorizontal: transformSize(50),
		borderRadius: transformSize(14),
		backgroundColor: 'white'
	},
	itemWrap: {
		paddingHorizontal: transformSize(50)
	},
	itemTag: {
		paddingVertical: transformSize(9),
		paddingHorizontal: transformSize(26),
		marginVertical: transformSize(20),
		// 让当前的元素变成行内元素
		alignSelf: 'flex-start',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: transformSize(26),
		borderBottomRightRadius: transformSize(26),
		overflow: 'hidden'
	},
	tagName: {
		includeFontPadding: false,
		fontSize: transformSize(28),
		color: 'white'
	},
	itemInner: {
		height: transformSize(345),
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: transformSize(30),
		marginBottom: transformSize(35)
	},
	itemImage: {
		width: transformSize(198),
		height: transformSize(342),
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#efefef'
	},
	pkHandle: {
		width: transformSize(44),
		height: transformSize(68),
		marginTop: transformSize(30),
	},
	itemPK: {
		width: transformSize(65),
		height: transformSize(32),
		alignSelf: 'center'
	},
	pkDescription: {
		includeFontPadding: false,
		lineHeight: transformSize(36),
		fontSize: transformSize(28),
		color: 'black'
	}
});