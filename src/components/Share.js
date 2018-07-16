import React from 'react';
import {
	StyleSheet,
	Dimensions,
	SafeAreaView
} from 'react-native';
import {
	View,
	Button,
	Image,
	Text,
	Touchable,
} from '@components';
import { commonStyle as styles, modal, umengTrack, isIphoneX } from '@utils';
import { qq, qZone, sina, wechat, wechatCircle, report, collect, unCollect } from '@assets';
import { Collect } from '@modules/article/components';
import { Share as YShareSDK } from 'ydk-react-native';

class Share1 extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null,
			targetConfigs: []
		};
		this.resolve = null;
	}

	render() {
		let targetsShare = this.state.targetConfigs.map((target, index) => {
			return this.renderItem(index, target);
		});

		let { collect, report } = this.props;
		let targetMore = [];
		if (collect) {
			let index = collect.status === 0 ? 5 : 6;
			targetMore.push(this.renderCollect(index, collect));
		}
		if (report) {
			let index = 7;
			targetMore.push(this.renderItem(index, defaultTargetConfigs[index]));
		}

		let panel = [style.panel];
		let divider = [style.divider];
		let cancelTriggerText = [style.cancelTriggerText];
		let targetsMore = [style.targetsMore];
		if (this.props.dark) {
			panel.push({
				backgroundColor: '#333333'
			})
			divider.push({
				backgroundColor: '#444444'
			})
			cancelTriggerText.push({
				color: 'white',
				backgroundColor: '#333333'
			})
			targetsMore.push({
				borderBottomColor: '#444444'
			})
		}

		let more = report || collect;
		if (!more) {
			panel.push({
				height: styles.transformSize(isIphoneX ? 448 : 428)
			})
		} else {
			panel.push({
				height: styles.transformSize(isIphoneX ? 542 : 522)
			})
		}

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={panel}>
					{this.renderTitle(more)}
					{this.renderPlatform(more, targetsShare)}
					{(this.state.targetConfigs.length > 0 && more) ? <View style={divider} /> : null}
					{this.renderMore(more, targetMore)}
					<View style={[divider, { marginHorizontal: styles.transformSize(0) }]} />
					<Touchable onPress={this.close} >
						<Text style={cancelTriggerText}>取消</Text>
					</Touchable>
				</View >
			</SafeAreaView>
		);
	}

	renderItem(index, target) {
		let icon = target.icon;
		return (
			<Touchable key={index} onPress={target.id === 'report' ? this.report : this.go(target)} style={style.target}>
				<Image source={icon.name} style={style.targetIcon} />
				<Text style={[style.targetText, this.props.dark ? { color: 'white' } : {}]}>{target.name}</Text>
			</Touchable>
		);
	}

	renderCollect(index, data) {
		return (
			<Collect key={index}
				id={data.id}
				active={data.favoriteFlag === 1}
				iconStyle={style.actionIcon}
				textStyle={[style.targetText]}
				style={[style.actionInner]}
				onChange={data.changeCollectState}
				moduleCode={data.moduleCode}
				showActiveText={true}
			/>
		);
	}

	renderTitle(more) {
		return (more ? null : <Text style={style.title}>分享到</Text>);
	}

	renderPlatform(more, targetsShare) {
		return (
			<View style={[style.targets, more
				? { paddingVertical: styles.transformSize(40) }
				: { paddingBottom: styles.transformSize(50) }]}>
				{targetsShare}
			</View>
		)
	}

	renderMore(more, targetsMore) {
		return (more ? <View style={[style.targets, style.targetsMore]}>{targetsMore}</View> : null)
	}

	componentWillMount() {
		this.getTargetConfigs();
	}

	getTargetConfigs = async () => {
		const targetConfigs = [];
		for (let config of defaultTargetConfigs) {
			let supportPlatform = await YShareSDK.getInstallPlatforms();
			if (supportPlatform.indexOf(config.app) >= 0) {
				targetConfigs.push(config);
			}
		}
		this.setState({
			targetConfigs
		});
	};

	go = (target) => async () => {
		umengTrack(`分享_${target.name}`)
		const data = Object.assign({
			title: '悠然一指，App 的推广驿站',
			content: '从海量的 App 中找到属于自己的那个。'
		}, this.props.data);
		console.log('share data', { ...data, target });
		YShareSDK.share(target.id, data).then((res) => {
			if (res) {
				data.callback(false);
			} else {
				data.callback(true);
			}
		}).catch((error) => {
			data.callback(false);
		});
		this.resolve();
		this.close();
	};

	report = () => {
		let href = `http://youranyizhi.mikecrm.com/jQuV4xR`;
		this.props.navigation.navigate('WebViewScreen', { url: href });
		modal.close()
	}

	close = () => {
		modal.close()
	}

}

const defaultTargetConfigs = [
	{
		name: '微信好友',
		id: 'weChat',
		icon: {
			name: wechat,
			color: '#31b482'
		},
		app: 'weChat'
	},
	{
		name: '朋友圈',
		id: 'weChatMoment',
		icon: {
			name: wechatCircle,
			color: '#31b482'
		},
		app: 'weChat'
	},
	{
		name: '新浪微博',
		id: 'sinaWeibo',
		icon: {
			name: sina,
			color: '#f2604d'
		},
		app: 'sinaWeibo'
	},
	{
		name: 'QQ 好友',
		id: 'qq',
		icon: {
			name: qq,
			color: '#7eb9eb'
		},
		app: 'qq'
	},
	{
		name: 'QQ 空间',
		id: 'qZone',
		icon: {
			name: qZone,
			color: '#f2c424'
		},
		app: 'qq'
	},
	{
		name: '收藏',
		id: 'collect',
		icon: {
			name: unCollect,
		},
		app: 'more'
	},
	{
		name: '已收藏',
		id: 'collected',
		icon: {
			name: collect,
		},
		app: 'more'
	},
	{
		name: '举报',
		id: 'report',
		icon: {
			name: report,
		},
		app: 'more'
	},
];

const style = StyleSheet.create({
	panel: {
		borderRadius: styles.transformSize(20),
		backgroundColor: 'white',
		overflow: 'hidden'
	},
	title: {
		textAlign: 'center',
		fontSize: styles.transformSize(24),
		color: '#999999',
		paddingVertical: styles.transformSize(58),
		includeFontPadding: false,
	},
	targets: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'nowrap',
		paddingHorizontal: '1.25%',
	},
	targetsMore: {
		paddingVertical: styles.transformSize(40),
	},
	target: {
		width: '19.5%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	targetIcon: {
		width: styles.transformSize(72),
		height: styles.transformSize(72),
		resizeMode: 'stretch',
	},
	targetText: {
		width: '100%',
		textAlign: 'center',
		fontSize: styles.transformSize(26),
		color: styles.fontColor_assist_2,
		marginTop: styles.transformSize(28),
		padding: 0,
		includeFontPadding: false
	},
	actionIcon: {
		fontSize: styles.transformSize(36),
		color: '#b3b3b3',
		backgroundColor: '#eeeeee',
		borderRadius: styles.transformSize(36),
		textAlign: 'center',
		padding: styles.transformSize(18),
		overflow: 'hidden',
		includeFontPadding: false,
	},
	actionInner: {
		width: '19.5%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	divider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: styles.color_border_2,
		marginHorizontal: styles.transformSize(30)
	},
	cancelTriggerText: {
		fontSize: styles.transformSize(32),
		color: 'black',
		paddingVertical: styles.transformSize(32),
		textAlign: 'center',
		backgroundColor: 'white',
		padding: 0,
		includeFontPadding: false,
	},
	containerDarkStyle: {
		backgroundColor: '#333333'
	},
	textDarkStyle: {
		color: 'white',
		backgroundColor: '#333333'
	}
});

export default Share1;