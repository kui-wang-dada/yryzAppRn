import React, { Component } from 'react';
import { ImageBackground, ART, DeviceEventEmitter, SafeAreaView } from 'react-native';
const { Surface, Shape, Path } = ART;
import { StyleSheet, ScrollView, View, Tag, TagGroup, Panel, Image, Icon, Touchable, FlowList, Text, Share, Toast } from '@components';
import { commonStyle as styles, modal, env } from '@utils';
import cache from '@utils/cache';

const JUMP = 0;  // 跳转
export default class Combination extends Component {

	state = {
		data: null
	}

	static data = null;
	static id = 0;
	static that = null;

	static navigationOptions = ({ navigation }) => {
		let headerRight = (
			<Touchable onPress={() => Combination.popupShare()}>
				<Icon name="more"
					style={{
						paddingHorizontal: styles.transformSize(30),
						fontSize: styles.transformSize(10),
						color: 'black'
					}}
				/>
			</Touchable>
		);

		let headerStyle = {
			borderBottomWidth: StyleSheet.hairlineWidth,
			borderColor: '#e5e5e5'
		};
		headerStyle = navigation.getParam('BLine') ? headerStyle : {};
		return { headerRight, headerTitle: navigation.getParam('title'), headerStyle };
	};

	renderTop(data) {
		return (
			<View style={decorate.top}>
				<ImageBackground source={require('@assets/images/combination-bg.png')} style={decorate.background}>
					<Text style={decorate.planName}>{data.configTitle}</Text>
					<Text style={decorate.planTip}>已为您预备{data.nodeCount}个可参考方案</Text>
				</ImageBackground>
			</View>
		);
	}

	renderListItem(node, index) {
		let number = index + 1;
		return (
			<Touchable key={node.resourceId} onPress={this.to.bind(this, node, index)} activeOpacity={1}>
				<View style={decorate.listItem}>
					<View style={decorate.plan}>
						<Text style={decorate.planText}>方案</Text>
						<Text style={decorate.planNumber}>{number < 10 ? ('0' + number) : number}</Text>
					</View>
					<View style={decorate.merchantIconWrap}>
						<Image source={{ uri: node.nodeImg1 }} style={decorate.merchantIcon} />
					</View>
					<View style={decorate.merchant}>
						<Text style={decorate.merchantName} numberOfLines={1} ellipsizeMode='tail'>{node.nodeTitle} </Text>
						<Text style={decorate.merchantSlogan} ellipsizeMode='tail'>{node.nodeDesc}</Text>
					</View>
				</View>
			</Touchable>
		);
	}

	render() {
		let { data } = this.state;
		if (!data) {
			return null;
		}
		return (
			<SafeAreaView style={decorate.container}>
				<ScrollView
					scrollEventThrottle={20}
					onScroll={this.onScroll.bind(this, data)}>
					<View style={decorate.inner}>
						{this.renderTop(data)}
						{
							data.nodeList.map((node, index) => {
								return this.renderListItem(node, index)
							})
						}
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}

	componentDidMount() {
		let { id, type } = this.props.navigation.state.params;
		Combination.id = id;
		Combination.that = this;
		Combination.previouType = type;
		cache(`/services/app/v1/find/findCombinDetail/${id}`, (res) => {
			let data = res.data.data
			Combination.data = data;
			this.setState({
				data
			}, () => {
				this.props.navigation.setParams({ title: data.configTitle });
			});
		});
	}

	to(node) {
		if (node.checkJump !== JUMP) {
			return;
		}
		let resourceType = node.resourceType;
		let navigation;
		switch (resourceType) {
			case 1:
				navigation = 'ArticleDetail';
				break;
			case 2:
				navigation = 'VideoDetail';
				break;
			case 3:
				navigation = 'AppDetail';
				break;
		}
		this.props.navigation.navigate(navigation, { id: node.resourceId });
	}

	static popupShare() {
		let data = {
			title: `【悠然一指】${Combination.data.configTitle}`,
			content: Combination.data.coverProfileDesc,
			url: `${env.webBaseUrl}/find-program-share/${Combination.id}`,
			imgUrl: Combination.data.indexBannerImg
		};

		let collect = {
			id: Combination.id,
			favoriteFlag: Combination.data.favoriteFlag,
			moduleCode: '1010',
			changeCollectState: (state) => {
				let flag = state ? 1 : 0;
				Combination.data.favoriteFlag = flag;
				Toast.show(state ? '收藏成功' : '已取消收藏');
				DeviceEventEmitter.emit('CancelCollection');
			}
		};
		modal.show(
			<Share data={data} report collect={collect} {...Combination.that.props} />,
			'share'
		);
	}


	onScroll(data, e) {
		let scrollTop = e.nativeEvent.contentOffset.y;
		let config = { title: '', BLine: false };
		if (styles.transformSize(scrollTop) > 30) {
			config.title = data.configTitle;
			config.BLine = true;
		}
		this.props.navigation.setParams(config)
	}

}

const decorate = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	top: {
		marginBottom: styles.transformSize(45)
	},
	inner: {
		paddingHorizontal: styles.transformSize(40),
		paddingTop: styles.transformSize(20),
	},
	background: {
		height: styles.transformSize(142),
		width: '100%',
		paddingLeft: styles.transformSize(40),
		paddingVertical: styles.transformSize(30),
		justifyContent: 'space-between'
	},
	listItem: {
		flexDirection: 'row',
		paddingVertical: styles.transformSize(35)
	},
	plan: {
		alignItems: 'center',
		marginRight: styles.transformSize(35)
	},
	planName: {
		includeFontPadding: false,
		fontSize: styles.transformSize(34),
		color: 'white'
	},
	planTip: {
		fontSize: styles.transformSize(26),
		color: '#e6deff'
	},
	planNumber: {
		includeFontPadding: false,
		fontSize: styles.transformSize(50),
		color: '#dbceeb'
	},
	planText: {
		includeFontPadding: false,
		fontSize: styles.transformSize(30),
		color: '#dbceeb'
	},
	merchant: {
		flex: 1,
		paddingBottom: styles.transformSize(6),
		justifyContent: 'space-between'
	},
	merchantIconWrap: {
		marginRight: styles.transformSize(30)
	},
	merchantIcon: {
		width: styles.transformSize(94),
		height: styles.transformSize(94),
		borderRadius: styles.transformSize(14),
	},
	merchantName: {
		fontSize: styles.transformSize(34),
		color: 'black'
	},
	merchantSlogan: {
		fontSize: styles.transformSize(28),
		color: '#999'
	}
});