import React from 'react';
import { StyleSheet, Platform, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import {
	Icon, Text, View, Image, ActionSheet, withNavigation, Toast, FlatList, Button, Touchable, TagGroup, Tag
} from '@components';
import { transformSize, commonStyle } from '@utils'
import { http } from "@services";
import { connect } from 'react-redux';
import { withUser } from '@modules/user';
import store from '../../store'
import PhotosManage from '../../modules/publish/components/photosManage'
import { saveInterests } from '@modules/transition/service/request';

const platform = Platform.OS;
let mapStateToProps = (state) => {
	return {
		userInfo: state.intro,
		city: state.city,
	};
};
let defaultValue = [];

// @withUser(true)
@connect(mapStateToProps)
@withNavigation
export default class MyProfileScreen extends React.Component {

	static navigationOptions = ({ navigation }) => ({
		headerStyle: {
			backgroundColor: '#fff',
			borderBottomWidth: StyleSheet.hairlineWidth,
			borderBottomColor: '#eeeeee',
			elevation: 0,
		},
		title: "个人信息",
		headerRight: (
			<TouchableOpacity onPress={navigation.getParam('submit')}>
				<Text style={{ color: commonStyle.color_theme, width: 50, fontSize: transformSize(30) }}>保存</Text>
			</TouchableOpacity>
		),
	})

	_submit = () => {
		// 判断是否修改过
		let isEqual = false;
		for (let index = 0; index < this.state.list.length; index++) {
			const element = this.state.list[index];
			const defaultElement = defaultValue[index];
			if (Array.isArray(element.value)) {
				if (element.index === 3) {
					// 地区: 比较地区字符串是否相同
					let address = element.value.join(' ');
					let defaultAddress = defaultElement.value.join(' ');
					isEqual = address === defaultAddress;
				} else if (element.index === 4) {
					// 标签: 比较标签kid是否相同
					let labelIds = Array.isArray(element.value) ? element.value.map((label) => {
						return label.kid;
					}) : [];
					let defaultLabelIds = Array.isArray(defaultElement.value) ? defaultElement.value.map((label) => {
						return label.kid;
					}) : [];
					isEqual = labelIds.join(',') === defaultLabelIds.join(',');
				}
			} else {
				isEqual = element.value === defaultElement.value;
			}
			if (isEqual === false) {
				break;
			}
		}

		if (isEqual) {
			Toast.show('您还没有编辑任何信息哦！')
			return;
		}

		let nickName = this.state.list[1].value;
		if (nickName < 4 || nickName > 10) {
			Toast.show('请重新设置昵称，昵称由4 - 10个字符，可由中英文、数字、特殊字符组成！')
			return;
		}

		this.props.navigation.goBack();

		// 判断是否需要上传图片
		let uri = this.state.list[0].value;
		if (uri !== '' && uri.startsWith('file://')) {
			this.props.dispatch({ type: 'SIGN_EDIT', payload: { custImg: uri } });
			uri = uri.replace('file://', '');
			// 上传图片
			PhotosManage.uploadData(uri, (url) => {
				this._updateListData(0, url);
				this._editorProfile(url);
			});
		} else {
			this._editorProfile(uri);
		}
	}

	_editorProfile = async (headImg) => {
		let labels = this.state.list[4].value;
		let labelIds = Array.isArray(labels) ? labels.map((label) => {
			return label.kid;
		}) : [];
		let { user } = store.getState();
		let params = {
			addr: this.state.list[3].value.join(' '),
			headImg: headImg,
			labelIds: labelIds,
			nickName: this.state.list[1].value,
			sex: this.state.list[2].value === '' ? '' : (this.state.list[2].value === '女' ? '0' : '1'),
			userId: user.userId,
			userSign: this.state.list[5].value
		};
		let res = await http.post(`/services/app/v1/user/cust/editor/local`, params);
		let resData = res.data;
		if (resData.code === '200') {
			// 更新本地user + 标签
			this.props.dispatch({ type: 'SIGN_EDIT', payload: { ...params, custImg: headImg } });
			this.props.dispatch({ type: 'CHOOSE_INTEREST', payload: labels });
			// Toast.show({ text: '保存成功~' })
		} else {
			// Toast.show({ text: resData.msg });
		}
		// 更新个人标签
		// 标签: 比较标签kid是否相同
		let defaultLabelIds = Array.isArray(defaultValue[4].value) ? defaultValue[4].value.map((label) => {
			return label.kid;
		}) : [];
		let isEqual = labelIds.join(',') === defaultLabelIds.join(',');
		if (isEqual === false) {
			let resp = await saveInterests(labelIds, true)
		}
	}

	constructor(props) {
		super(props);
		let { user, transition } = store.getState();
		// alert(JSON.stringify(user))
		let initValue = [
			{ index: 0, name: '头像', value: user.custImg },
			{ index: 1, name: '昵称', placeholder: '请设置昵称', editable: false, value: user.nickName },
			{ index: 2, name: '性别', placeholder: '未设置', value: user.sex === '' ? user.sex : user.sex === '0' ? '女' : '男' },
			{ index: 3, name: '地区', placeholder: '未设置', value: user.addr.split(' ') },
			{ index: 4, name: '个人标签', placeholder: '还未设置个人标签', value: transition.interests ? transition.interests : [] },
			{ index: 5, name: '个人简介', placeholder: '还没有任何关于个人的介绍哦~', value: user.userSign },
		];
		defaultValue = [...initValue].map((item) => {
			return { ...item };
		});
		this.state = {
			// headImg: user.custImg,
			// nickName: user.nickName,
			// gender: user.sex,
			// introduce: user.userSign,
			// labels: transition.interests,
			// address: user.addr.split(' '),
			list: initValue,
		};
	}

	// /services/app/v1/user/cust/editor/local

	_updateListData = (index, value) => {
		let list = this.state.list;
		let item = list[index]

		item.value = value;
		item = { ...item };
		// list.splice(index, 1, item);
		this.setState({
			list: [...list]
		})
		// alert(JSON.stringify(list));
	}

	_onEndEdit = (type, result) => {
		let index;
		if (type === 0) {
			index = 2;
		} else if (type === 1) {
			index = 4;
		} else if (type === 2) {
			index = 3;
		}
		this._updateListData(index, result);
	}

	_onPressHeadImg = async () => {
		let result = await PhotosManage.seletePhoto();
		let uri = "file://" + result.images[0];
		this._updateListData(0, uri);
	}

	_onPressGender = () => {
		let value = this.state.list[2].value;
		let config = { type: 0, gender: value, onEndEdit: this._onEndEdit };
		this.props.navigation.navigate('EditMyProfile', { config });
	}

	_onPressAddress = () => {
		let value = this.state.list[3].value;
		let config = { type: 2, address: value, onEndEdit: this._onEndEdit };
		this.props.navigation.navigate('EditMyProfile', { config });
	}

	_onPressLabel = () => {
		let value = this.state.list[4].value;
		let config = { type: 1, labels: value, onEndEdit: this._onEndEdit };
		this.props.navigation.navigate('EditMyProfile', { config });
	}

	_onPressNickname = () => {
		this._nicknameTextInput.focus();
	}

	_onNicknameOnChange = (event) => {
		this._updateListData(1, event.nativeEvent.text);
	}

	_onIntroduceOnChange = (event) => {
		let text = event.nativeEvent.text;
		// if (text.endsWith('\n')) {
		// 	text = text.replace('\n', '');
		// 	this._introduceTextInput.blur();
		// }
		this._updateListData(5, text);
	}

	_renderIntroduce = () => {
		let item = this.state.list[5]
		return <View style={decorate.intro}>
			<Text style={decorate.introTitle}>{item.name}</Text>
			<TextInput
				ref={ref => { this._introduceTextInput = ref; }}
				placeholder={item.placeholder}
				returnKeyType="done"
				maxLength={100}
				style={decorate.introContent}
				value={item.value}
				multiline={true}
				onChange={this._onIntroduceOnChange}
				placeholderTextColor={'#999'}
				underlineColorAndroid="transparent"
				blurOnSubmit={true}
			/>
		</View>
	}

	_renderLabels = (item) => {
		// alert(JSON.stringify(item.value));
		if (Array.isArray(item.value) && item.value.length > 0) {
			let items = item.value.map((label, index) => {
				if (index < 2) {
					return <Tag style={{ marginBottom: 0 }}>{label.labelName}</Tag>;
				}
			});
			return <TagGroup >{items}</TagGroup>;
		} else {
			return <Text style={decorate.placeholder}>{item.placeholder}</Text>
		}
	}

	_renderItem = (item, onPress) => {
		let value = item.value;
		if (item.index === 3) {
			// 地区
			value = item.value.join(' ');
		}
		let textStyle = value !== '' ? { color: '#333' } : null;
		value = value !== '' ? value : item.placeholder;
		return <Touchable onPress={onPress}>
			<View style={decorate.listItem} >
				<Text style={decorate.listName}>{item.name}</Text>
				{
					item.placeholder ?
						<View style={decorate.listRight}>
							{
								item.index === 1 ? <Icon name="edit" style={decorate.arrow} /> : <Icon name="arrow-right" style={decorate.arrow} />
							}
							{
								item.index === 4 ?
									this._renderLabels(item)
									:
									(item.editable === undefined ?
										(<Text style={[decorate.placeholder, textStyle]}>{value}</Text>)
										:
										(<TextInput
											ref={ref => { this._nicknameTextInput = ref; }}
											placeholder="请设置昵称"
											returnKeyType="done"
											maxLength={10}
											style={[decorate.placeholder, textStyle, { paddingLeft: transformSize(50) }]}
											value={item.value}
											onChange={this._onNicknameOnChange}
											placeholderTextColor={'#999'}
											underlineColorAndroid="transparent"
										/>))
							}
						</View>
						:
						<Image style={decorate.userAvatar} defaultSourceStyle={{ backgroundColor: 'transparent' }} source={{ uri: item.value }} defaultSource={require('@assets/images/nologin-user.png')} />
				}
			</View>
		</Touchable >
	}

	render() {
		return (
			<View style={decorate.container}>



				<ScrollView keyboardShouldPersistTaps='handled'>
					<KeyboardAvoidingView style={{ flex: 1 }}
						keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' ? 'position' : 'padding'}>
						<View style={decorate.listGroup}>
							{this._renderItem(this.state.list[0], this._onPressHeadImg)}
							{this._renderItem(this.state.list[1], this._onPressNickname)}
							{this._renderItem(this.state.list[2], this._onPressGender)}
							{this._renderItem(this.state.list[3], this._onPressAddress)}
							{this._renderItem(this.state.list[4], this._onPressLabel)}
						</View>

						{this._renderIntroduce()}
					</KeyboardAvoidingView>
				</ScrollView>

			</View>
		);
	}

	componentDidMount() {
		let submit = this._submit;
		this.props.navigation.setParams({ submit });
	}
}


const decorate = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F2F2F2'
	},
	listGroup: {
		paddingHorizontal: transformSize(40),
		borderBottomWidth: transformSize(10),
		borderColor: '#eee',
		backgroundColor: 'white'
	},
	listItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: transformSize(40),
		alignItems: 'center',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: '#eee'
	},
	listRight: {
		flexDirection: 'row-reverse',
		alignItems: 'center',
		flex: 1,
	},
	listName: {
		fontSize: transformSize(32),
		color: '#333'
	},
	placeholder: {
		padding: 0,
		flex: 1,
		marginRight: transformSize(20),
		fontSize: transformSize(30),
		color: '#999',
		textAlign: 'right',
	},
	labelGroup: {
		padding: 0,
		// marginRight: transformSize(0),
		textAlign: 'right',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	label: {
		color: '#999',
		borderColor: '#e3e3e3',
		borderWidth: transformSize(2)
	},
	arrow: {
		fontSize: transformSize(30),
		color: '#cecece',
	},
	userAvatar: {
		width: transformSize(115),
		height: transformSize(115),
		borderRadius: transformSize(57.5),
		backgroundColor: 'transparent'
	},
	intro: {
		paddingTop: transformSize(30),
		paddingHorizontal: transformSize(40),
		minHeight: transformSize(400),
		backgroundColor: 'white'
	},
	introTitle: {
		marginBottom: transformSize(20),
		fontSize: transformSize(32),
		color: 'black'
	},
	introContent: {
		fontSize: transformSize(30),
		color: '#333',
		minHeight: transformSize(290),
		textAlignVertical: 'top',
		padding: 0,
	}
});