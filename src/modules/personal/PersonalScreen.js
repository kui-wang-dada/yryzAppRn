import React from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { View, FlowList, Text, StyleSheet, YModal, Touchable, ImageBackground, Modal, Image, Icon, ScrollView, UIManager } from '@components';
import {
	commonStyle as styles,
	resizeImage,
	umengTrack,
	transformSize,
} from '@utils';
import {
	share,
	http,
	sign
} from '@services';
import ButtonWithAuth from '../user/components/ButtonWithAuth'

const NO_LOGIN_IMG = require('@assets/images/nologin-user.png');
import { connect } from 'react-redux';
import style from '@modules/login/styles';
let mapStateToProps = (state) => {
	return {
		user: state.user
	};
};
@connect(mapStateToProps)
export default class PersonalScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inviteFlagData: [],
		}
	}

	list = [
		{ icon: 'homepage', name: '个人主页', color: '#a2b9fe', route: 'Profile' },
		{ icon: 'collection-a', name: '我的收藏', color: '#ff8948', route: 'MyFavorite', track: '我的_我的收藏' },
		{ icon: 'Focus', name: '我的关注', color: '#ff8c8c', route: 'MyAttention', track: '我的_我的关注' },
		{ icon: 'message', name: '我的消息', color: '#91bdf6', route: 'Message', track: '我的_我的消息' },
		{ icon: 'top-up', name: '账号充值', color: '#c2a6e9', route: 'AccountRecharge', track: '我的_账号充值' },
		{ icon: 'invitation', name: '邀请好友', color: '#faa26d', route: 'InviteFriends', track: '我的_邀请好友' },
		{ icon: 'service', name: '联系客服', color: '#91dda3', route: 'CustomService', track: '我的_联系客服' },
		{ icon: 'help', name: '帮助', color: '#fdc856', route: 'Help', track: '我的_帮助' },
	];

	renderTop() {
		let { user } = this.props;
		return (
			<View style={decorate.topWrapper}>
				<View style={decorate.nav}>
					<View style={decorate.navInner}>
						<View></View>
						<Text style={decorate.userName}>{user.userName || '我的'}</Text>
						<Touchable onPress={() => this.props.navigation.navigate('SettingScreen')}>
							<Icon name="setting" style={decorate.settingIcon} />
						</Touchable>
					</View>
				</View>
				<Touchable onPress={this.touchTip.bind(this, user.isSignIn)} activeOpacity={1}>
					<View style={decorate.top}>
						<Image
							source={user.isSignIn ? { uri: user.custImg } : NO_LOGIN_IMG}
							style={decorate.headPortrait} />
						<Text style={decorate.tip}>{user.isSignIn ? '查看和编辑个人资料' : '未登录'}</Text>
					</View>
				</Touchable>
			</View>
		);
	}

	renderListItem(item, index) {
		if (item.name === '账号充值' && Platform.OS === 'ios') {
			return null;
		}
		if (item.name === '邀请好友' && !this.state.inviteFlagData.inviteFlag) {
			return null;
		}
		return (
			<ButtonWithAuth onPress={this.to.bind(this, item)} key={index}>
				<View style={decorate.row}>
					<View style={decorate.rowLeft}>
						<Icon name={item.icon} style={[{ color: item.color }, decorate.rowIcon]} />
						<Text style={decorate.itemName}>{item.name}</Text>
					</View>
					<Icon name="arrow-right" style={decorate.arrow} />
				</View>
			</ButtonWithAuth>
		);
	}

	to(item) {
		if (item.track) {
			umengTrack(item.track);
		}
		// 如果用户没有登录
		if (!this.props.user.isSignIn) {
			this.props.navigation.navigate('LoginScreen');
			return;
		}
		this.props.navigation.navigate(item.route, { type: 1, id: this.props.user.userId });
	}


	render() {
		return (
			<SafeAreaView style={decorate.container}>
				<ScrollView >
					{this.renderTop()}
					<View style={decorate.rowGroup}>
						{
							this.list.map((item, index) => {
								return this.renderListItem(item, index)
							})
						}
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}


	componentDidMount() {
		this.getInviteFlag();
	}

	getInviteFlag = async () => {
		let res = await http({ url: `/services/app/v1/new/invite/checkOnInvite` });
		let inviteFlagData = res.data.data;
		this.setState({ inviteFlagData });

	}

	touchTip(state) {
		if (state) {
			// alert('用户编辑');
			this.props.navigation.navigate('MyProfile');
			return;
		}
		this.props.navigation.navigate('LoginScreen');
	}

}

const decorate = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eee'
	},
	topWrapper: {
		paddingTop: Platform.OS === 'ios' ? transformSize(90) : transformSize(50),
		borderColor: '#eee',
		borderBottomWidth: transformSize(10),
		backgroundColor: 'white'
	},
	top: {
		paddingTop: transformSize(50),
		paddingBottom: transformSize(50),
		alignItems: 'center',
		marginBottom: transformSize(10),
		backgroundColor: 'white'
	},
	userName: {
		includeFontPadding: false,
		fontSize: transformSize(38),
		color: 'black'
	},
	headPortrait: {
		width: transformSize(146),
		height: transformSize(146),
		marginBottom: transformSize(38),
		borderRadius: transformSize(73),
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#e4e4e4',
		backgroundColor: 'transparent'
	},
	tip: {
		fontSize: transformSize(28),
		color: '#999'
	},
	rowGroup: {
		paddingHorizontal: transformSize(44),
		backgroundColor: 'white'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: transformSize(40)
	},
	rowIcon: {
		marginRight: transformSize(26),
		fontSize: transformSize(32),
	},
	itemName: {
		fontSize: transformSize(32),
		color: 'black'
	},
	rowLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	arrow: {
		fontSize: transformSize(32),
		color: '#cecece'
	},
	settingIcon: {
		fontSize: transformSize(34),
		color: '#bfbfbf'
	},
	nav: {
		justifyContent: 'flex-end',
	},
	navInner: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingRight: transformSize(30),
		paddingLeft: transformSize(64),
		alignItems: 'center'
	}
});


PersonalScreen.navigationOptions = ({ navigation }) => {
	return {
		header: null
	};
}
