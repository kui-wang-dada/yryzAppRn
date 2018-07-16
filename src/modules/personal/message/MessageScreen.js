import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, ScrollView, Image, Text, Icon, Toast } from '@components';
import { connect } from 'react-redux';
import { transformSize, commonStyle } from '@utils';
import moment from 'moment';
import * as PushAction from './message.action';
import { MessageHeader } from './components'

let mapStateTopProps = (state) => {
	let { pushInfoList, announceInfo, pushCount } = state.push
	return { pushInfoList, announceInfo, pushCount }
}

@connect(mapStateTopProps)
export default class MessageScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checkIds: {},
			showCheck: false
		};
	}

	static navigationOptions = ({ navigation }) => {
		return {
			header: (props) => (<MessageHeader
				{...props}
				showCheck={navigation.getParam('showCheck')}
				showRight={navigation.getParam('showRight')}
				onTitleRight={navigation.getParam('onTitleRight')}
				onTitleLeft={navigation.getParam('onTitleLeft')} />),
			title: '消息'
		}
	}

	componentDidMount() {
		this.props.navigation.setParams({
			showCheck: this.state.showCheck,
			showRight: this.props.pushInfoList.length !== 0,
			onTitleLeft: this.onTitleLeft,
			onTitleRight: this.onTitleRight
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		let length = this.props.pushInfoList.length;
		let nextLength = nextProps.pushInfoList.length;
		if (length !== nextLength) {
			this.props.navigation.setParams({ showRight: length !== 0 });
		}
		return true;
	}

	renderItem = (item, index) => {
		let check = this.state.checkIds[item.messageId];
		console.log('showCheck', this.state.showCheck)
		return (
			<View key={index}>
				<TouchableOpacity key={index} style={styles.item} onPress={() => this.toItemScreen(item, index)}>
					{(this.state.showCheck && index >= 0) ?
						(<Icon name={check ? 'choose-b' : 'choose-a'} color={check ? commonStyle.color_theme : '#666'} size={transformSize(35)}
							style={{ marginRight: transformSize(20) }} />) : null}
					<View>
						<Image style={styles.itemIcon} square source={index < 0 ? require('./assets/icon-notice.png') : { uri: item.iconUrl }} />
						{item.hasRead ? null : <View style={styles.itemRedDot} />}
					</View>
					<View style={styles.itemContent}>
						<View style={styles.itemRow}>
							<Text style={styles.itemTitle}>{item.title}</Text>
							<Text style={styles.itemTime}>{this.getPushTime(item.time)}</Text>
						</View>
						<Text numberOfLines={1}>{item.content}</Text>
					</View>
				</TouchableOpacity>
				<View style={[styles.line, { marginHorizontal: transformSize(40) }]} />
			</View>
		);
	}

	render() {
		let { announceInfo, pushInfoList } = this.props;
		return (
			<View style={styles.container}>
				<View style={[styles.line]} />
				<ScrollView>
					{this.renderItem(announceInfo, -1)}
					{pushInfoList.map(this.renderItem)}
				</ScrollView>
			</View>
		);
	}

	onTitleRight = () => {
		if (this.state.showCheck) {// 删除
			let checkItems = [];
			let { checkIds } = this.state;
			for (let key in checkIds) {
				if (checkIds[key]) {
					checkItems.push({ messageId: key })
				}
			}
			if (checkItems.length === 0) {
				Toast.show('请选择要删除的通知~')
				return;
			}
			Toast.show('删除成功~')
			this.props.dispatch({ type: PushAction.DELETE_PUSH, payload: checkItems })
		} else {
			this.setState({ showCheck: true });
			this.props.navigation.setParams({ showCheck: true });
		}
	}

	onTitleLeft = () => {
		if (this.state.showCheck) {
			this.setState({
				showCheck: false
			});
			this.props.navigation.setParams({ showCheck: false });
		} else {
			this.props.navigation.goBack();
		}
	}

	onCheck = (item) => {
		let checkIds = { ...this.state.checkIds };
		checkIds[item.messageId] = !checkIds[item.messageId];
		this.setState({ checkIds });
	}

	toItemScreen = (item, index) => {
		if (index < 0) {
			this.props.navigation.navigate('Announce');
			this.props.dispatch({ type: PushAction.CHANGE_ANNOUNCE, payload: item });
		} else {
			if (this.state.showCheck) {
				this.onCheck(item)
			} else {
				// (0 公告，1 活动，2 关注,3 评论）
				let screens = { 1: 'ArticleDetail', 2: 'AppDetail', 3: 'ArticleDetail' };
				this.props.navigation.navigate(screens[item.type], {
					id: item.typeId
				});
				this.props.dispatch({ type: PushAction.CHANGE_PUSH, payload: item });
			}
		}
	}

	getPushTime = (time) => {
		if (time) {
			if (new Date(time).toDateString() === new Date().toDateString()) {
				return moment(time, 'x').format('HH:mm');
			}
			return moment(time, 'x').format('YYYY-MM-DD');
		} else {
			return ' ';
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	title: {
		width: '100%',
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		height: transformSize(100)
	},
	titleLeft: {
		position: 'absolute',
		left: transformSize(30),
		width: transformSize(150)
	},
	titleCancel: {
		fontSize: transformSize(30),
		color: commonStyle.color_theme,
		textAlign: 'left'
	},
	titleBack: {
		fontSize: transformSize(32),
		color: '#666',
		textAlign: 'left',
		marginLeft: -4
	},
	titleRight: {
		position: 'absolute',
		right: transformSize(30),
		width: transformSize(90)
	},
	item: {
		paddingVertical: transformSize(38),
		paddingHorizontal: transformSize(40),
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemIcon: {
		width: transformSize(98),
		height: transformSize(98)
	},
	itemRedDot: {
		position: 'absolute',
		top: 0,
		right: -5,
		width: transformSize(25),
		height: transformSize(25),
		borderWidth: transformSize(2),
		borderRadius: transformSize(20),
		borderColor: '#fff',
		backgroundColor: '#f00'
	},
	itemContent: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'column',
		paddingLeft: transformSize(28),
		paddingBottom: transformSize(5),
		color: '#666',
	},
	itemRow: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	itemTitle: {
		fontSize: transformSize(34),
		paddingTop: transformSize(5),
		color: '#000'
	},
	itemTime: {
		fontSize: transformSize(24),
		textAlign: 'right',
		color: '#aaa'
	},
	line: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#eee'
	}
});