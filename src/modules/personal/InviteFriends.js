import React from 'react';
import {
	StyleSheet, View, ImageBackground, Image, Text, Share, Toast
} from '@components';
import {
	TouchableOpacity, Clipboard, Modal
} from 'react-native';
import {
	transformSize, modal, env
} from '@utils';
import { http } from '@services';
import bg from '@assets/images/invitefriend-bg.jpg'
import codeBg from '@assets/images/invitefriends-codebg.png'
import btnImg from '@assets/images/invite-btn-bg.png'
import { connect } from 'react-redux';
let mapStateToProps = (state) => {
	return {
		user: state.user
	};
};
@connect(mapStateToProps)
export default class InviteFriend extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userData: [],
			modalVisible: false,
		}
	}

	static navigationOptions = {
		headerTitle: '邀请好友',
		headerTitleStyle: {
			flex: 1,
			textAlign: 'center',
			fontSize: transformSize(34),
			fontWeight: '400',
		},
		headerRight: <View />
	};
	render() {
		return (
			<View style={{ flex: 1 }}>
				<ImageBackground source={bg} style={{ flex: 1, alignItems: 'center', position: 'relative' }}>
					<ImageBackground source={codeBg} style={s.codeStyle}>
						<Text style={s.codeText}>{this.state.userData.myInviteCode}</Text>
					</ImageBackground>
					<TouchableOpacity style={s.copyTextWrap} onPress={this.handlecopyInviteCode}><Text style={s.copyText}>点击复制</Text></TouchableOpacity>
					<TouchableOpacity style={s.btnImgStyleWrap} onPress={this.handleshare}><Image source={btnImg} style={s.btnImgStyle} /></TouchableOpacity>
				</ImageBackground>
			</View>
		)
	}

	handlecopyInviteCode = () => {
		let { nickName, myInviteCode } = this.state.userData;
		Clipboard.setString(`您的好友(${nickName})邀请你加入“武汉融众”旗下“悠然一指”，邀请码为：${myInviteCode}，iOS 下载：https://itunes.apple.com/cn/app/%E6%82%A0%E7%84%B6%E4%B8%80%E6%8C%87/id1108712331?mt=8，Android 下载：http://android.myapp.com/myapp/detail.htm?apkName=com.rz.rz_rrz&ADTAG=mobile`);
		Toast.show('邀请码复制成功，快分享给好友吧')
	}

	handleshare = () => {
		let { nickName, id } = this.state.userData;
		let data = {
			title: `悠然一指`,
			content: `您的好友(${nickName})邀请加入‘悠然一指’`,
			url: `${env.webBaseUrl}/share-load/${this.props.user.userId}`,
			image: '',
		}

		let component = (<Share  {...this.props} data={data} report />)
		modal.show(component, 'share');
	}

	getData = async () => {
		let res = await http({ url: `/services/app/v1/user/single/local/${this.props.user.userId}` });
		let userData = res.data.data;
		this.setState({ userData });
	}

	componentDidMount() {
		this.getData();
	}
}


const s = StyleSheet.create({
	codeStyle: {
		position: 'absolute',
		top: '56%',
		width: transformSize(458),
		height: transformSize(157),
		alignItems: 'center',
	},
	codeText: {
		color: '#fff',
		fontSize: transformSize(48),
		height: transformSize(54),
		marginTop: transformSize(50)
	},
	copyTextWrap: {
		position: 'absolute',
		bottom: '22%',
	},
	copyText: {
		marginTop: transformSize(48),
		color: '#9ee9ff',
		fontSize: transformSize(36),
	},
	btnImgStyleWrap: {
		position: 'absolute',
		bottom: '6%',
	},
	btnImgStyle: {
		marginTop: transformSize(90),
		width: transformSize(560),
		height: transformSize(80),
	}
})
